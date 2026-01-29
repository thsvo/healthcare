import mongoose from 'mongoose';

const FollowUpOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a follow-up option name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.FollowUpOption || mongoose.model('FollowUpOption', FollowUpOptionSchema);
