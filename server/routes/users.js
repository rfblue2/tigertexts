import express from 'express';
import fetch from 'isomorphic-fetch';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { TransactionSerializer } from '../utils/serializers/transactionSerializer';
import {
  UserDeserializer,
  UserSerializer,
} from '../utils/serializers/userSerializer';
import { BookSerializer } from '../utils/serializers/bookSerializer';
import User from '../models/user';
import Book from '../models/book';
import Transaction from '../models/transaction';
import wrap from '../utils/wrap';

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

  let user = await User.findOne({ facebook_id: userId });
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

const getCurrentUser = function (req, res, next) {
  User.findById(req.auth.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

const getOne = (req, res) => {
  res.json(UserSerializer.serialize(req.user));
};

router.route('/me')
  .get(authenticate, getCurrentUser, getOne);

/**
 * API Routes
 * TODO Secure all these API routes with jwt so that the correct user can access them
 * TODO currently checks query param for mongo id
 */

router.route('/:id/activity')

  .get(wrap(async (req, res) => {
    const user = await User.findById(req.params.id);
    const id = user._id;
    const activity = await Transaction.find({
      $or: [
        { seller: id },
        { buyer: id },
      ],
    });
    res.json(TransactionSerializer.serialize(activity));
  }));

// Convenience method for viewing (get) and adding (post) favorites
router.route('/:id/favorites')

  .get(wrap(async (req, res) => {
    const user = await User.findById(req.params.id);
    const favorites = await Book.find({ _id: { $in: user.toObject().favorite } });
    res.json(BookSerializer.serialize(favorites));
  }))

  .post(wrap(async (req, res) => {
    const data = await UserDeserializer.deserialize(req.body);
    await User.findOneAndUpdate({
      _id: req.params.id,
    }, { $push: { favorite: { $each: data.favorite } } }, { new: true });
    res.status(200).end();
  }));

// Convenience method for viewing (get) and adding (post) books being sold
router.route('/:id/selling')

  .get(wrap(async (req, res) => {
    const user = await User.findById(req.params.id);
    const selling = await Book.find({ _id: { $in: user.toObject().selling } });
    res.json(BookSerializer.serialize(selling));
  }))

  .post(wrap(async (req, res) => {
    const data = await UserDeserializer.deserialize(req.body);
    await User.findOneAndUpdate({
      _id: req.params.id,
    }, { $push: { selling: { $each: data.selling } } }, { new: true });
    res.status(200).end();
  }));

export default router;

