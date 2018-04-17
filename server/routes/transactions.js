import express from 'express';
import { APIError } from '../utils/errors';
import {
  TransactionSerializer,
  TransactionDeserializer,
} from '../utils/serializers/transactionSerializer';
import Transaction from '../models/transaction';
import wrap from '../utils/wrap';

const router = express.Router();

router.route('/')

  .get(async (req, res) => {
    const transactions = await Transaction.find();
    res.json(TransactionSerializer.serialize(transactions));
  })

  .post(wrap(async (req, res) => {
    const data = await TransactionDeserializer.deserialize(req.body);
    const transaction = new Transaction({ ...data });
    const newTransaction = await transaction.save();
    res.status(201).json(TransactionSerializer.serialize(newTransaction));
  }));

router.route('/:id')

  .get(wrap(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) throw new APIError('Resource not found', 404);
    res.json(TransactionSerializer.serialize(transaction));
  }))

  // Transactions should be immutable

  .delete(wrap(async (req, res) => {
    const transaction = await Transaction.findByIdAndRemove(req.params.id);
    res.json(TransactionSerializer.serialize(transaction));
  }));

export default router;
