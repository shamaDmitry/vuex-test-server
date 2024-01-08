import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
