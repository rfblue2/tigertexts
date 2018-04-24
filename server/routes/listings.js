import express from 'express';
import { APIError } from '../utils/errors';
import { serializeListing, deserializeListing } from '../utils/serializers/listingSerializer';
import Listing from '../models/listing';
import wrap from '../utils/wrap';
import { parseInclude, populateQuery } from '../utils/queryparse';

const router = express.Router();

// Execute query and serialize listing and send it
const getAndSend = wrap(async (req, res) => {
  const listing = await req.query.exec();
  if (!listing) throw new APIError('Resource not found', 404);
  res.json(serializeListing(listing, { included: req.fields.length !== 0 }));
});

router.route('/')

  .get(parseInclude, (req, res, next) => {
    req.query = Listing.find();
    next();
  }, populateQuery, getAndSend)

  .post(wrap(async (req, res) => {
    const data = await deserializeListing(req.body);
    const listing = new Listing({ ...data });
    const newListing = await listing.save();
    res.status(201).json(serializeListing(newListing, { included: false }));
  }));

router.route('/:id')

  .get(parseInclude, (req, res, next) => {
    req.query = Listing.findById(req.params.id);
    next();
  }, populateQuery, getAndSend)

  .patch(wrap(async (req, res, next) => {
    const data = await deserializeListing(req.body);
    req.query = await Listing.findOneAndUpdate({
      _id: req.params.id,
    }, { ...data }, { new: true });
    next();
  }), populateQuery, getAndSend)

  .delete((req, res, next) => {
    req.query = Listing.findByIdAndRemove(req.params.id);
    next();
  }, populateQuery, getAndSend);

export default router;
