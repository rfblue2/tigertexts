import express from 'express';
import fetch from 'isomorphic-fetch';
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

  console.log("Token verified");

  const longLivedToken = await fetchLongAccessToken(token);

  console.log("Obtained long access token: " + longLivedToken);

  let user = await User.findOne({ facebook_id: userId });
  let returnedUser;

  // Create a new user
  if (!user) {
    user = new User({
      name,
      email,
      long_lived_token: longLivedToken,
      facebook_id: userId,
      role: 'Member',
    });
    returnedUser = await user.save();
  } else {
    returnedUser = await User.findOneAndUpdate({
      _id: user._id,
    }, { long_lived_token: longLivedToken }, { new: true });
  }

  // TODO hide longlivedtoken (mongoose has option for this) and pass jwt instead

  console.log("Returning user: " + JSON.stringify(returnedUser, null, 2));

  res.json(UserSerializer.serialize(returnedUser));
}));

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

