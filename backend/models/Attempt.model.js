const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    questionText: String,
    category: String,
    paperOrder: Number,
    selectedOption: {
      type: Number,
      min: -1, // -1 if skipped/unanswered
      max: 3,
      default: -1
    },
    correctIndex: Number,
    isCorrect: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    studentId: {
      type: String,
      required: [true, 'Student ID / Register No is required'],
      trim: true
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 26
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    },
    categoryScores: {
      type: Map,
      of: new mongoose.Schema(
        {
          correct: { type: Number, default: 0 },
          total: { type: Number, default: 0 }
        },
        { _id: false }
      ),
      default: {}
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Attempt', attemptSchema);
