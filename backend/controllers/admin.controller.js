const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const Question = require('../models/Question.model');
const Attempt = require('../models/Attempt.model');

// @desc    Admin Login with 8h JWT expiration
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check DB for Admin user
    let admin = await Admin.findOne({ username });

    // Fallback/bootstrap check if no admin seeded yet
    if (!admin && username === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'admin123')) {
      admin = new Admin({ username, password });
      await admin.save();
    } else if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials'
      });
    } else {
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid administrator credentials'
        });
      }
    }

    const payload = {
      id: admin._id,
      username: admin.username,
      role: 'admin'
    };

    const secret = process.env.JWT_SECRET || 'super_secret_terminal_jwt_key_mca_2026';
    // 8h token expiry as requested
    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Session active for 8 hours.',
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

// @desc    Get all questions for Admin (includes correctIndex & explanation)
// @route   GET /api/admin/questions
// @access  Protected (Admin)
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ paperOrder: 1 });
    return res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching admin questions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

// @desc    Create a new question
// @route   POST /api/admin/questions
// @access  Protected (Admin)
exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correctIndex, category, paperOrder, explanation } = req.body;

    if (!text || !options || correctIndex === undefined || !category || !paperOrder) {
      return res.status(400).json({
        success: false,
        message: 'All fields (text, options[4], correctIndex, category, paperOrder) are required'
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Options must contain exactly 4 choices'
      });
    }

    const question = new Question({
      text: text.trim(),
      options: options.map((opt) => String(opt).trim()),
      correctIndex: Number(correctIndex),
      category,
      paperOrder: Number(paperOrder),
      explanation: explanation ? explanation.trim() : ''
    });

    await question.save();

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error creating question:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message
    });
  }
};

// @desc    Update an existing question
// @route   PUT /api/admin/questions/:id
// @access  Protected (Admin)
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options, correctIndex, category, paperOrder, explanation } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    if (text !== undefined) question.text = text.trim();
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Options must be an array of 4 items'
        });
      }
      question.options = options.map((opt) => String(opt).trim());
    }
    if (correctIndex !== undefined) question.correctIndex = Number(correctIndex);
    if (category !== undefined) question.category = category;
    if (paperOrder !== undefined) question.paperOrder = Number(paperOrder);
    if (explanation !== undefined) question.explanation = explanation.trim();

    await question.save();

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error updating question:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/admin/questions/:id
// @access  Protected (Admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      id
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error deleting question:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

// @desc    Get all student attempts
// @route   GET /api/admin/attempts
// @access  Protected (Admin)
exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ submittedAt: -1 });
    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching attempts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attempts',
      error: error.message
    });
  }
};

// @desc    Get single attempt by ID with full answers breakdown
// @route   GET /api/admin/attempts/:id
// @access  Protected (Admin)
exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findById(id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    return res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching attempt details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attempt details',
      error: error.message
    });
  }
};

// @desc    Delete an attempt record
// @route   DELETE /api/admin/attempts/:id
// @access  Protected (Admin)
exports.deleteAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attempt.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Attempt record deleted successfully',
      id
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error deleting attempt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete attempt',
      error: error.message
    });
  }
};
