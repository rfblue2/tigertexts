/* eslint no-underscore-dangle: "off" */
import express from 'express';
import fetch from 'isomorphic-fetch';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { serializeTransaction } from '../utils/serializers/transactionSerializer';
import {
  serializeUser,
  deserializeUser,
} from '../utils/serializers/userSerializer';
import { serializeBook } from '../utils/serializers/bookSerializer';
import User from '../models/user';
import Book from '../models/book';
import Listing from '../models/listing';
import Transaction from '../models/transaction';
import wrap from '../utils/wrap';
import { parseInclude, populateQuery } from '../utils/queryparse';

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
  req.query = User.findById(req.auth.id);
  req.user = await req.query.exec();
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
 * TODO Secure all these API routes with jwt so that the correct user can access them
 * TODO currently checks query param for mongo id
 */

router.route('/activity')

  .get(authenticate, getCurrentUser, wrap(async (req, res) => {
    const id = req.user._id;
    const activity = await Transaction.find({
      $or: [
        { seller: id },
        { buyer: id },
      ],
    });
    res.json(serializeTransaction(activity));
  }));

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
    }, { $push: { favorite: { $each: data.favorite.map(f => f.id) } } }, { new: true });
    const books = await Book.find({ _id: { $in: data.favorite.map(f => f.id) } });
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
    const data = await deserializeUser(req.body, { special: true });
    await User.findOneAndUpdate({
      _id: req.user._id,
    }, { $push: { selling: { $each: data.selling.map(s => s.id) } } }, { new: true });
    await Promise.all(data.selling.map(async (s) => {
      const listingObj = {
        kind: 'platform',
        title: `Seller: ${req.user.name}`,
        book: s.id,
        seller: req.user._id,
      };
      console.log(JSON.stringify(s, null,2))
      if (s.price && s.price !== '') listingObj.price = s.price;
      if (s.comment && s.comment !== '') listingObj.detail = s.comment;
      const listing = new Listing(listingObj);
      listing.save();
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
    await Listing.findOneAndRemove({ seller: req.user._id, book: req.params.id });
    res.json(serializeBook(book));
  }));

export default router;

