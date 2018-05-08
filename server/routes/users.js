/* eslint no-underscore-dangle: "off" */
import express from 'express';
import fetch from 'isomorphic-fetch';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import mongoose from 'mongoose';
import sgMail from '@sendgrid/mail';
import {
  serializeUser,
  deserializeUser,
} from '../utils/serializers/userSerializer';
import { serializeBook } from '../utils/serializers/bookSerializer';
import User from '../models/user';
import Book from '../models/book';
import Listing from '../models/listing';
import Offer from '../models/offer';
import wrap from '../utils/wrap';
import { parseInclude, populateQuery } from '../utils/queryparse';
import { deserializeOffer, serializeOffer } from '../utils/serializers/offerSerializer';

const router = express.Router();

/**
 * Auth Routes
 */

const APP_ID = '1949273201750772';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const verifyToken = async (token, userId) => {
  let tokenRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${APP_ID}|${APP_SECRET}`);
  tokenRes = await tokenRes.json();
  return tokenRes.user_id === userId;
};

// Exchange short term token for long lived token
const fetchLongAccessToken = async (token) => {
  let longLivedTokenRes = await fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${token}`);
  longLivedTokenRes = await longLivedTokenRes.json();
  return longLivedTokenRes.access_token;
};

router.get('/login', wrap(async (req, res) => {
  const {
    token, userId, name, email,
  } = req.query;

  if (!verifyToken(token, userId)) {
    res.status(401).end();
    return;
  }

  const longLivedToken = await fetchLongAccessToken(token);

  // console.log(`Obtained long access token: ${longLivedToken}`);

  let user = await User.findOne({ 'facebookProvider.id': userId });
  let savedUser;

  // Create a new user
  if (!user) {
    user = new User({
      name,
      email,
      facebookProvider: {
        token: longLivedToken,
        id: userId,
      },
      role: 'Member',
    });
    savedUser = await user.save();
    const welcomeMsg = {
      to: email,
      from: 'rfong@princeton.edu',
      subject: 'Welcome to TigerTexts',
      text: `Thank you for choosing TigerTexts as your one stop shop for all
             your coursebook needs.  We are excited to have you!  Head over to 
             tigertexts.herokuapp.com to start.`,
      html: `<p>Thank you for choosing TigerTexts as your one stop shop for all
             your coursebook needs.  We are excited to have you!  Head over to 
             <a href="tigertexts.herokuapp.com">TigerTexts</a> to start.</p>`,
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(welcomeMsg);
  } else {
    savedUser = await User.findOneAndUpdate({
      _id: user._id,
    }, { long_lived_token: longLivedToken }, { new: true });
  }

  // JWT token payload
  const auth = {
    id: savedUser._id, facebook_id: userId, name, email,
  };

  // generate JWT
  req.token = jwt.sign(auth, 'my-secret', { expiresIn: 60 * 120 });

  // return JWT
  res.setHeader('x-auth-token', req.token);
  res.status(200).send(auth);
}));

const authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: (req) => {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  },
});

const getCurrentUser = wrap(async (req, res, next) => {
  req.q = User.findById(req.auth.id);
  req.user = await req.q.exec();
  next();
});

router.route('/me')
  .get(
    authenticate, parseInclude, getCurrentUser, populateQuery,
    wrap(async (req, res) => {
      const user = await req.query.exec();
      res.json(serializeUser(user, { included: req.fields.length !== 0 }));
    }),
  );

/**
 * API Routes
 */

// Convenience method for viewing (get) and adding (post) favorites
router.route('/favorites')

  .get(authenticate, getCurrentUser, wrap(async (req, res) => {
    const favorites = await Book.find({ _id: { $in: req.user.toObject().favorite } });
    res.json(serializeBook(favorites));
  }))

  .post(authenticate, getCurrentUser, wrap(async (req, res) => {
    const data = await deserializeUser(req.body);
    await User.findOneAndUpdate({
      _id: req.user._id,
    }, { $push: { favorite: { $each: data.favorite } } }, { new: true });
    const books = await Book.find({ _id: { $in: data.favorite } });
    res.json(serializeBook(books));
  }));

router.route('/favorites/:id')

  .delete(authenticate, getCurrentUser, wrap(async (req, res) => {
    const user = req.user.toObject();
    user.favorite = user.favorite.filter(f => String(f) !== req.params.id);
    await User.findOneAndUpdate({
      _id: req.user._id,
    }, { favorite: user.favorite }, { new: true });
    const book = await Book.findById(req.params.id);
    res.json(serializeBook(book));
  }));

// Convenience method for viewing (get) and adding (post) books being sold
router.route('/selling')

  .get(authenticate, getCurrentUser, wrap(async (req, res) => {
    const selling = await Book.find({ _id: { $in: req.user.toObject().selling } });
    res.json(serializeBook(selling));
  }))

  .post(authenticate, getCurrentUser, wrap(async (req, res) => {
    const data = await deserializeUser(req.body, { included: true });
    await User.findOneAndUpdate({
      _id: req.user._id,
    }, { $push: { selling: { $each: data.selling.map(s => s.id) } } }, { new: true });
    await Promise.all(data.selling.map(async (s) => {
      // create a new listing
      const listingObj = {
        kind: 'platform',
        title: `Seller: ${req.user.name}`,
        book: s.id,
        seller: req.user._id,
      };
      if (s.price && s.price !== '') listingObj.price = s.price;
      if (s.comment && s.comment !== '') listingObj.detail = s.comment;
      const listing = new Listing(listingObj);
      await listing.save();
    }));
    const books = await Book.find({ _id: { $in: data.selling.map(s => s.id) } });
    res.json(serializeBook(books));
  }));

router.route('/selling/:id')

  .delete(authenticate, getCurrentUser, wrap(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const user = req.user.toObject();
    user.selling = user.selling.filter(f => String(f) !== req.params.id);
    await User.findOneAndUpdate({
      _id: req.user._id,
    }, { selling: user.selling }, { new: true });
    const listing = await Listing.findOneAndRemove({ seller: req.user._id, book: req.params.id });
    await Offer.remove({ listing: mongoose.Types.ObjectId(listing._id) });
    res.json(serializeBook(book));
  }));

// Convenience method for getting and adding (post) offers for buying books
// When retrieving offers, retrieves both user initiated and interested user offers
router.route('/offers')
  .get(parseInclude, authenticate, getCurrentUser, wrap(async (req, res) => {
    const userOffersQuery = Offer.find({
      buyer: mongoose.Types.ObjectId(req.user._id.toString()),
    });
    req.fields.forEach((f) => {
      if (f.includes('.')) {
        const [field, sub] = f.split('.');
        userOffersQuery.populate(field, sub);
      } else {
        userOffersQuery.populate(f);
      }
    });
    const userOffers = await userOffersQuery.exec();
    const listings = await Listing.find({ seller: req.user._id });
    let otherOffers = await Promise.all(listings.map(async (l) => {
      const otherOfferQuery = Offer.find({ listing: l._id });
      req.fields.forEach((f) => {
        if (f.includes('.')) {
          const [field, sub] = f.split('.');
          otherOfferQuery.populate(field, sub);
        } else {
          otherOfferQuery.populate(f);
        }
      });
      return otherOfferQuery.exec();
    }));
    otherOffers = otherOffers.reduce((a, b) => a.concat(b), []);
    res.json(serializeOffer([...userOffers, ...otherOffers]));
  }))

  .post(authenticate, getCurrentUser, wrap(async (req, res) => {
    const data = await deserializeOffer(req.body);
    const offer = new Offer({ ...data });
    const newOffer = await offer.save();
    const listing = await Listing.findById(data.listing)
      .populate('seller')
      .populate('book');
    const buyer = await User.findById(data.buyer);
    const offerMsg = {
      to: listing.seller.email,
      from: 'rfong@princeton.edu',
      subject: 'Someone is interested in purchasing your books!',
      text: `${buyer.name} has offered to purchase ${listing.book.title}
             for $${data.price}. Go to tigertexts.herokuapp.com to view
             the offer. Buyer can be contacted at ${buyer.email}.`,
      html: `<p>${buyer.name} has offered to purchase ${listing.book.title}
             for $${data.price}. Buyer can be contacted at ${buyer.email}.
             <a href="tigertexts.herokuapp.com">View the offer</a>.
             </p>`,
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(offerMsg);
    res.status(201).json(serializeOffer(newOffer));
  }));

router.route('/offers/:id')

  .delete(authenticate, getCurrentUser, wrap(async (req, res) => {
    const offer = await Offer.findByIdAndRemove(req.params.id);
    const buyer = await User.findById(offer.buyer);
    const listing = await Listing.findById(offer.listing)
      .populate('seller')
      .populate('book');
    if (req.query.action === 'accept') {
      const offerMsg = {
        to: buyer.email,
        from: 'rfong@princeton.edu',
        subject: 'Your TigerTexts offer has been updated',
        text: `${listing.seller.name} has accepted your offer to purchase
             ${listing.book.title} for $${offer.price}! Contact the seller
             at ${listing.seller.email}`,
        html: `<p>${listing.seller.name} has accepted your offer to purchase
             ${listing.book.title} for $${offer.price}! Contact the seller
             at ${listing.seller.email}.
             </p>`,
      };
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      sgMail.send(offerMsg);
    } else if (req.query.action === 'decline') {
      const offerMsg = {
        to: buyer.email,
        from: 'rfong@princeton.edu',
        subject: 'Your TigerTexts offer has been updated',
        text: `${listing.seller.name} has declined your offer to purchase
             ${listing.book.title} for $${offer.price}.`,
        html: `<p>${listing.seller.name} has declined your offer to purchase
             ${listing.book.title} for $${offer.price}.
             </p>`,
      };
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      sgMail.send(offerMsg);

    }
    res.json(serializeOffer(offer));
  }));

export default router;

