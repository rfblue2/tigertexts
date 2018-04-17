import express from 'express';
import fetch from 'isomorphic-fetch';
import User from '../models/user';
import wrap from '../utils/wrap';

const router = express.Router();

/**
 * User API Routes.  Note that we do not conform to
 * JSON API format.  This is primarily used for user auth.
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

  const longLivedToken = fetchLongAccessToken(token);

  let user = await User.findOne({ facebook_id: userId });

  // Create a new user
  if (!user) {
    user = new User({
      name,
      email,
      long_lived_token: longLivedToken,
      facebook_id: userId,
      role: 'Member',
    });
    await user.save();
  } else {
    await User.findOneAndUpdate({
      _id: user._id,
    }, { long_lived_token: longLivedToken }, { new: true });
  }

  res.status(200).end();
}));

export default router;

