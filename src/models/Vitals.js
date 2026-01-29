import mongoose from 'mongoose';

const VitalsChangeSchema = new mongoose.Schema({
  field: String,
  oldValue: String,
  newValue: String,
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const VitalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Weight
  weightLbs: {
    type: String,
    default: '',
  },
  weightOz: {
    type: String,
    default: '',
  },
  // Height
  heightFt: {
    type: String,
    default: '',
  },
  heightIn: {
    type: String,
    default: '',
  },
  // Temperature
  temperature: {
    type: String,
    default: '',
  },
  // BMI
  bmi: {
    type: String,
    default: '',
  },
  // Blood Pressure
  bloodPressureSystolic: {
    type: String,
    default: '',
  },
  bloodPressureDiastolic: {
    type: String,
    default: '',
  },
  // Respiratory Rate
  respiratoryRate: {
    type: String,
    default: '',
  },
  // Pulse
  pulse: {
    type: String,
    default: '',
  },
  // Blood Sugar
  bloodSugar: {
    type: String,
    default: '',
  },
  // Fasting
  fasting: {
    type: String,
    default: '',
  },
  // O2 Saturation
  o2Saturation: {
    type: String,
    default: '',
  },
  // Notes
  notes: {
    type: String,
    default: '',
  },
  // Change history
  changeHistory: [VitalsChangeSchema],
  // Created/Updated by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Vitals || mongoose.model('Vitals', VitalsSchema);
