const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, getMe, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin, validateRegister } = require('../middleware/validationMiddleware');

// Rate limiter for authentication attempts (15 minutes, max 30 attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again in 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public Authentication endpoints
router.post('/login', authLimiter, validateLogin, login);
router.post('/register', authLimiter, validateRegister, register);

// Protected Profile endpoint
router.get('/me', protect, getMe);

module.exports = router;

