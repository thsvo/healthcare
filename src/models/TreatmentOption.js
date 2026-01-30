import mongoose from 'mongoose';

const TreatmentOptionSchema = new mongoose.Schema({
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
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicationOption',
  },
}, {
  timestamps: true,
});

// Force model recompilation in dev
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.TreatmentOption;
}

export default mongoose.models.TreatmentOption || mongoose.model('TreatmentOption', TreatmentOptionSchema);
