import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  kind: { type: String, enum: ['amazon', 'facebook', 'platform', 'labyrinth'] },
  title: String,
  date_posted: Date,
  detail: String,
  price: Number,
  price_type: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // on platform only
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
});

// Note: Do not use arrow function due to scoping requirements
// see: https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
ListingSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) { this.createdAt = now; }
  this.updatedAt = now;
  next();
});

export default mongoose.model('Listing', ListingSchema);
