import express from 'express';
import { APIError } from '../utils/errors';
import {
  serializeTransaction,
  deserializeTransaction,
} from '../utils/serializers/transactionSerializer';
import Transaction from '../models/transaction';
import wrap from '../utils/wrap';
import { parseInclude, populateQuery } from '../utils/queryparse';

const router = express.Router();

// Execute query and serialize transaction and send it
const getAndSend = wrap(async (req, res) => {
  const transaction = await req.query.exec();
  if (!transaction) throw new APIError('Resource not found', 404);
  res.json(serializeTransaction(transaction, { included: req.fields.length !== 0 }));
});

router.route('/')

  .get(parseInclude, (req, res, next) => {
    req.query = Transaction.find();
    next();
  }, populateQuery, getAndSend)

  .post(wrap(async (req, res) => {
    const data = await deserializeTransaction(req.body);
    const transaction = new Transaction({ ...data });
    const newTransaction = await transaction.save();
    res.status(201).json(serializeTransaction(newTransaction, { included: false }));
  }));

router.route('/:id')

  .get(parseInclude, (req, res, next) => {
    req.query = Transaction.findById(req.params.id);
    next();
  }, populateQuery, getAndSend)

  // Transactions should be immutable

  .delete(parseInclude, (req, res, next) => {
    req.query = Transaction.findByIdAndRemove(req.params.id);
    next();
  }, populateQuery, getAndSend);

export default router;
