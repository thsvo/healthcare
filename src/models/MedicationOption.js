import mongoose from 'mongoose';

const MedicationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Force model recompilation in dev
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.MedicationOption;
}

export default mongoose.models.MedicationOption || mongoose.model('MedicationOption', MedicationOptionSchema);
