const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuizAttempt } = require('../controllers/quiz.controller');

// Public student endpoints
router.get('/questions', getQuizQuestions);
router.post('/submit', submitQuizAttempt);

module.exports = router;
