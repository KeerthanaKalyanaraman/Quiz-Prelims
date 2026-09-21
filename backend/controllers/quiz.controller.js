const Question = require('../models/Question.model');
const Attempt = require('../models/Attempt.model');

// @desc    Get all questions for student quiz (sanitized - no correctIndex or explanation)
// @route   GET /api/quiz/questions
// @access  Public
exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .select('-correctIndex -explanation')
      .sort({ paperOrder: 1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('[QUIZ CONTROLLER] Error fetching questions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz questions',
      error: error.message
    });
  }
};

// @desc    Submit student quiz attempt and calculate score
// @route   POST /api/quiz/submit
// @access  Public
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { studentName, studentId, answers = [], timeSpentSeconds = 0 } = req.body;

    if (!studentName || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student Name and Student ID are required'
      });
    }

    // Fetch all questions from the database with answer keys
    const allQuestions = await Question.find().sort({ paperOrder: 1 });
    const questionMap = new Map();
    allQuestions.forEach((q) => questionMap.set(q._id.toString(), q));

    // Map of answers submitted by student: questionId -> selectedOption
    const submissionMap = new Map();
    answers.forEach((ans) => {
      if (ans && ans.questionId) {
        submissionMap.set(ans.questionId.toString(), Number(ans.selectedOption));
      }
    });

    let totalScore = 0;
    const categoryStats = {
      C: { correct: 0, total: 0 },
      'C++': { correct: 0, total: 0 },
      Python: { correct: 0, total: 0 },
      Java: { correct: 0, total: 0 },
      OOP: { correct: 0, total: 0 },
      SQL: { correct: 0, total: 0 }
    };

    const gradedAnswers = [];
    const reviewData = [];

    // Evaluate every question in the paper
    allQuestions.forEach((q) => {
      const qId = q._id.toString();
      const selected = submissionMap.has(qId) ? submissionMap.get(qId) : -1;
      const isCorrect = selected === q.correctIndex;

      if (isCorrect) {
        totalScore += 1;
      }

      // Track category performance
      if (categoryStats[q.category]) {
        categoryStats[q.category].total += 1;
        if (isCorrect) {
          categoryStats[q.category].correct += 1;
        }
      }

      gradedAnswers.push({
        questionId: q._id,
        questionText: q.text,
        category: q.category,
        paperOrder: q.paperOrder,
        selectedOption: selected,
        correctIndex: q.correctIndex,
        isCorrect
      });

      // Review payload returned to student
      reviewData.push({
        questionId: q._id,
        paperOrder: q.paperOrder,
        text: q.text,
        options: q.options,
        category: q.category,
        selectedOption: selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const totalQuestions = allQuestions.length || 26;
    const percentage = Number(((totalScore / totalQuestions) * 100).toFixed(2));

    // Persist attempt to MongoDB
    const attempt = new Attempt({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      answers: gradedAnswers,
      score: totalScore,
      totalQuestions,
      percentage,
      categoryScores: categoryStats,
      timeSpentSeconds,
      submittedAt: new Date()
    });

    await attempt.save();

    return res.status(201).json({
      success: true,
      message: 'Successfully submitted the quiz',
      attemptId: attempt._id,
      studentName: attempt.studentName,
      studentId: attempt.studentId,
      timeSpentSeconds,
      submittedAt: attempt.submittedAt
    });
  } catch (error) {
    console.error('[QUIZ CONTROLLER] Error scoring attempt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process quiz submission',
      error: error.message
    });
  }
};
