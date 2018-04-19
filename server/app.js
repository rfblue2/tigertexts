import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Error } from 'jsonapi-serializer';

import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import User from './models/user';

import config from 'config';
import Users from './routes/users';
import Classes from './routes/classes';
import Books from './routes/books';
import Listings from './routes/listings';
import Transactions from './routes/transactions';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(logger('dev'));
}

mongoose.connect(process.env.MONGODB_URI || config.DBHost);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Auth
const APP_ID = '1949273201750772';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
passport.use(new FacebookTokenStrategy(
  {
    clientID: APP_ID,
    clientSecret: APP_SECRET,
  },
  ((accessToken, refreshToken, profile, done) => {
    User.upsertFbUser(accessToken, refreshToken, profile, (err, user) => done(err, user));
  }),
));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Route for API endpoints
app.use('/api/users', Users);
app.use('/api/classes', Classes);
app.use('/api/books', Books);
app.use('/api/listings', Listings);
app.use('/api/transactions', Transactions);

// render react app for anything else
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'MongoError') {
    res.status(err.name === 'ValidationError' ? 400 : 500);
    res.json(new Error({
      title: err.message,
      detail: req.app.get('env') === 'development' ? err.errors : {},
    }));
  } else {
    res.status(err.status || 500);
    res.json(new Error({
      status: err.status || 500,
      title: err.message,
      detail: req.app.get('env') === 'development' ? err : {},
    }));
  }
});

module.exports = app;
