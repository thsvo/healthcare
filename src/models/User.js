import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const DocumentSchema = new mongoose.Schema({
  url: String,
  name: String,
  type: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'doctor'],
    default: 'user',
  },
  // Profile fields from survey
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  address: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending',
  },
  // Link to survey response
  surveyResponseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurveyResponse',
  },
  documents: [DocumentSchema],
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent mongoose model compilation error in development
if (mongoose.models.User) {
  // If we're in dev and need to update the schema, we delete the model
  // This allows the schema to be recompiled with new fields/enums
  delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
