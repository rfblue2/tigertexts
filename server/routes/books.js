import express from 'express';
import { APIError } from '../utils/errors';
import { BookSerializer, BookDeserializer } from '../utils/serializers/bookSerializer';
import { ListingSerializer } from '../utils/serializers/listingSerializer';
import Book from '../models/book';
import Listing from '../models/listing';
import wrap from '../utils/wrap';

const router = express.Router();

router.route('/')

  .get(async (req, res) => {
    const books = await Book.find();
    res.json(BookSerializer.serialize(books));
  })

  .post(wrap(async (req, res) => {
    const data = await BookDeserializer.deserialize(req.body);
    const book = new Book({ ...data });
    const newBook = await book.save();
    res.status(201).json(BookSerializer.serialize(newBook));
  }));

router.route('/:id')

  .get(wrap(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new APIError('Resource not found', 404);
    res.json(BookSerializer.serialize(book));
  }))

  .patch(wrap(async (req, res) => {
    const data = await BookDeserializer.deserialize(req.body);
    const book = await Book.findOneAndUpdate({
      _id: req.params.id,
    }, { ...data }, { new: true });
    res.json(BookSerializer.serialize(book));
  }))

  .delete(wrap(async (req, res) => {
    const book = await Book.findByIdAndRemove(req.params.id);
    res.json(BookSerializer.serialize(book));
  }));

router.route('/:id/listings')

  .get(wrap(async (req, res) => {
    const listings = await Listing.find({ book: req.params.id });
    if (!listings) throw new APIError('No listings associated with book')
    res.json(ListingSerializer.serialize(listings));
  }));

export default router;
