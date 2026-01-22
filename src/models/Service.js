import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image'],
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
