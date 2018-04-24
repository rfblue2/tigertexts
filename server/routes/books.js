import express from 'express';
import { APIError } from '../utils/errors';
import { serializeBook, deserializeBook } from '../utils/serializers/bookSerializer';
import { serializeListing } from '../utils/serializers/listingSerializer';
import Book from '../models/book';
import Listing from '../models/listing';
import wrap from '../utils/wrap';
import { parseInclude, populateQuery } from '../utils/queryparse';

const router = express.Router();


// Execute query and serialize book and send it
const getAndSend = wrap(async (req, res) => {
  const book = await req.query.exec();
  if (!book) throw new APIError('Resource not found', 404);
  res.json(serializeBook(book, { included: req.fields.length !== 0 }));
});

router.route('/')

  .get(parseInclude, (req, res, next) => {
    req.query = Book.find();
    next();
  }, populateQuery, getAndSend)

  .post(wrap(async (req, res) => {
    const data = await deserializeBook(req.body);
    const book = new Book({ ...data });
    const newBook = await book.save();
    res.status(201).json(serializeBook(newBook));
  }));

router.route('/:id')

  .get(parseInclude, (req, res, next) => {
    req.query = Book.findById(req.params.id);
    next();
  }, populateQuery, getAndSend)

  .patch(parseInclude, wrap(async (req, res, next) => {
    const data = await deserializeBook(req.body);
    req.query = Book.findOneAndUpdate({
      _id: req.params.id,
    }, { ...data }, { new: true });
    next();
  }), populateQuery, getAndSend)

  .delete((req, res, next) => {
    req.query = Book.findByIdAndRemove(req.params.id);
    next();
  }, populateQuery, getAndSend);

router.route('/:id/listings')

  .get(wrap(async (req, res) => {
    const listings = await Listing.find({ book: req.params.id });
    if (!listings) throw new APIError('No listings associated with book');
    res.json(serializeListing(listings));
  }));

export default router;
