import express from 'express';
import { APIError } from '../utils/errors';
import { ListingSerializer, ListingDeserializer } from '../utils/serializers/listingSerializer';
import Listing from '../models/listing';
import wrap from '../utils/wrap';

const router = express.Router();

router.route('/')

  .get(async (req, res) => {
    const listings = await Listing.find();
    res.json(ListingSerializer.serialize(listings));
  })

  .post(wrap(async (req, res) => {
    const data = await ListingDeserializer.deserialize(req.body);
    const listing = new Listing({ ...data });
    const newListing = await listing.save();
    res.status(201).json(ListingSerializer.serialize(newListing));
  }));

router.route('/:id')

  .get(wrap(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new APIError('Resource not found', 404);
    res.json(ListingSerializer.serialize(listing));
  }))

  .patch(wrap(async (req, res) => {
    const data = await ListingDeserializer.deserialize(req.body);
    const listing = await Listing.findOneAndUpdate({
      _id: req.params.id,
    }, { ...data }, { new: true });
    res.json(ListingSerializer.serialize(listing));
  }))

  .delete(wrap(async (req, res) => {
    const listing = await Listing.findByIdAndRemove(req.params.id);
    res.json(ListingSerializer.serialize(listing));
  }));

export default router;
