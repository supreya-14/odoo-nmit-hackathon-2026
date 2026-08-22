const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    authorName: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'OVERDUE'],
      default: 'TODO',
    },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    completionDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
