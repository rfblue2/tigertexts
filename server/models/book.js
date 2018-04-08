import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  isbn: { type: String, required: true },
  title: { type: String, required: true },
  book_type: { type: String, enum: ['softcover', 'hardcover'] },
  authors: [String],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

// Note: Do not use arrow function due to scoping requirements
// see: https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
BookSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) { this.createdAt = now; }
  this.updatedAt = now;
  next();
});

export default mongoose.model('Book', BookSchema);
