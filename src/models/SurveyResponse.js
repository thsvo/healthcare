import mongoose from 'mongoose';

const SurveyResponseSchema = new mongoose.Schema({
  userInfo: {
    firstName: String,
    lastName: String,
    birthday: Date,
    sex: String,
    company: String,
    email: String,
    phone: String,
    address: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SurveyQuestion',
    },
    // Optional category override for ad-hoc items
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    questionText: String,
    answer: mongoose.Schema.Types.Mixed,
    addedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    // Edit tracking
    editedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    editedAt: Date,
    editHistory: [{
      editedBy: {
        name: String,
        role: String,
        id: mongoose.Schema.Types.ObjectId,
      },
      editedAt: Date,
      previousQuestionText: String,
      previousAnswer: mongoose.Schema.Types.Mixed,
      newQuestionText: String,
      newAnswer: mongoose.Schema.Types.Mixed,
    }],
    // Discontinue tracking
    discontinued: {
      type: Boolean,
      default: false
    },
    discontinuedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    discontinuedAt: Date,
    discontinueReason: String,
    // Prescription details
    isPrescription: {
      type: Boolean,
      default: false
    },
    prescriptionDetails: {
      medication: String,
      dosage: String,
      frequency: String,
      duration: String,
      refills: Number,
      instructions: String,
      addedBy: {
        name: String,
        role: String,
        id: mongoose.Schema.Types.ObjectId,
      },
      addedAt: Date,
    },
  }],
  // Medication items
  medications: [{
    medicationOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicationOption',
    },
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    addedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    editedAt: Date,
    discontinued: {
      type: Boolean,
      default: false
    },
    discontinuedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    discontinuedAt: Date,
    discontinueReason: String,
  }],
  // Treatment items
  treatments: [{
    treatmentOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TreatmentOption',
    },
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    notes: String,
    addedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    editedAt: Date,
    discontinued: {
      type: Boolean,
      default: false
    },
    discontinuedBy: {
      name: String,
      role: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    discontinuedAt: Date,
    discontinueReason: String,
  }],
  status: {
    type: String,
    enum: ['new', 'reviewed', 'archived', 'approved', 'rejected'],
    default: 'new',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  followUp: String,
  refillReminder: String,
  providerNote: String, // Legacy note field
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    senderRole: String, // 'admin', 'doctor', 'user'
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true,
});

// Force model recompilation in dev to ensure schema updates are picked up
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.SurveyResponse;
}

export default mongoose.models.SurveyResponse || mongoose.model('SurveyResponse', SurveyResponseSchema);
