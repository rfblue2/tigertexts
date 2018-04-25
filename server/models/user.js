import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  name: String,
  email: String,
  facebookProvider: {
    type: {
      id: String,
      token: String,
    },
    select: false,
  },
  role: {
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member',
  },
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  selling: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

// Note: Do not use arrow function due to scoping requirements
// see: https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
UserSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) { this.createdAt = now; }
  this.updatedAt = now;
  next();
});

export default mongoose.model('User', UserSchema);
