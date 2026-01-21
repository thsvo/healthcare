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
  }],
  status: {
    type: String,
    enum: ['new', 'reviewed', 'archived'],
    default: 'new',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.SurveyResponse || mongoose.model('SurveyResponse', SurveyResponseSchema);
