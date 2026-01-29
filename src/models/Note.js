import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'Phone Visit',
      'Triage Encounter',
      'Video Encounter',
      'Misc Task',
      'Misc Clinical',
      'Misc Protected',
      'Official Letter',
      'Message',
      'Enter COVID Results',
      'Personal Task',
      'Vitals',
    ],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
