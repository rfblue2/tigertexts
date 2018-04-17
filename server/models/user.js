import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  facebook_id: { type: String, required: true },
  long_lived_token: String,
  role: {
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member',
  },
});

export default mongoose.model('User', UserSchema);
