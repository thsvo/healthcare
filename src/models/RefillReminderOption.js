import mongoose from 'mongoose';

const RefillReminderOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a refill reminder option name'],
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
  days: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.RefillReminderOption || mongoose.model('RefillReminderOption', RefillReminderOptionSchema);
