const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  adminLogin,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllAttempts,
  getAttemptById,
  deleteAttempt
} = require('../controllers/admin.controller');

// Admin authentication route (public)
router.post('/login', adminLogin);

// Protected routes (requires 8h JWT token)
router.use(adminAuth);

// Question management
router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Student attempts management
router.get('/attempts', getAllAttempts);
router.get('/attempts/:id', getAttemptById);
router.delete('/attempts/:id', deleteAttempt);

module.exports = router;
