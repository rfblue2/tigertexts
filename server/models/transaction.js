import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  initiated: Date,
  price: Number,
  status: String, // Pending, Complete, Canceled, etc.
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
});

// Note: Do not use arrow function due to scoping requirements
// see: https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
TransactionSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) { this.createdAt = now; }
  this.updatedAt = now;
  next();
});

export default mongoose.model('Transaction', TransactionSchema);
