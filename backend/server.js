const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in terminal style
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[SYS-REQ] ${timestamp} | ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Terminal Quiz Evaluation API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Terminal error: Route ${req.originalUrl} not found in system`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[TERMINAL SERVER] Core API listening at http://localhost:${PORT}`);
  console.log(`[TERMINAL SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});
