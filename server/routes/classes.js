import express from 'express';
import { APIError } from '../utils/errors';
import { ClassSerializer, ClassDeserializer } from '../utils/serializers/classSerializer';
import { serializeBook } from '../utils/serializers/bookSerializer';
import Class from '../models/class';
import Book from '../models/book';
import wrap from '../utils/wrap';

const router = express.Router();

router.route('/')

  .get(wrap(async (req, res) => {
    const classes = await Class.find();
    res.json(ClassSerializer.serialize(classes));
  }))

  .post(wrap(async (req, res) => {
    const data = await ClassDeserializer.deserialize(req.body);
    const classObj = new Class({ ...data });
    const newClass = await classObj.save();
    res.status(201).json(ClassSerializer.serialize(newClass));
  }));

router.route('/:id')

  .get(wrap(async (req, res) => {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) throw new APIError('Resource not found', 404);
    res.json(ClassSerializer.serialize(classObj));
  }))

  .patch(wrap(async (req, res) => {
    const data = await ClassDeserializer.deserialize(req.body);
    const classObj = await Class.findOneAndUpdate({
      _id: req.params.id,
    }, { ...data }, { new: true });
    res.json(ClassSerializer.serialize(classObj));
  }))

  .delete(wrap(async (req, res) => {
    const classObj = await Class.findByIdAndRemove(req.params.id);
    res.json(ClassSerializer.serialize(classObj));
  }));

router.route('/:id/books')

  .get(wrap(async (req, res) => {
    const books = await Book.find({ classes: req.params.id });
    if (!books) throw new APIError('No books associated with class', 404);
    res.json(serializeBook(books));
  }));

export default router;
