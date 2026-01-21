import mongoose from 'mongoose';

const SurveyQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please provide question text'],
  },
  type: {
    type: String,
    enum: ['text', 'textarea', 'select', 'radio', 'checkbox'],
    default: 'text',
  },
  options: [{
    type: String,
  }],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SurveyQuestion || mongoose.model('SurveyQuestion', SurveyQuestionSchema);
