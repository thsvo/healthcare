import mongoose from 'mongoose';

const QuickResponseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String, // Stores HTML from Tiptap
    required: [true, 'Please add content'],
  },
  category: {
    type: String,
    default: 'General',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Force model recompilation in dev
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.QuickResponse;
}

export default mongoose.models.QuickResponse || mongoose.model('QuickResponse', QuickResponseSchema);
