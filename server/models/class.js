import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  numbers: { type: [String], required: true },
  title: { type: String, required: true },
});

// Note: Do not use arrow function due to scoping requirements
// see: https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
ClassSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) { this.createdAt = now; }
  this.updatedAt = now;
  next();
});

export default mongoose.model('Class', ClassSchema);
