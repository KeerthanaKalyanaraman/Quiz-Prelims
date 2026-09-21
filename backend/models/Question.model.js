const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4;
        },
        message: 'A question must have exactly 4 options'
      }
    },
    correctIndex: {
      type: Number,
      required: [true, 'Correct index is required'],
      min: 0,
      max: 3
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['C', 'C++', 'Python', 'Java', 'OOP', 'SQL']
    },
    paperOrder: {
      type: Number,
      required: [true, 'Paper order is required'],
      min: 1,
      max: 50
    },
    explanation: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);
