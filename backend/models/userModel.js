import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  prizes: Number
});

export default mongoose.model('User', userSchema);
