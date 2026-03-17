const express = require('express');
const router = express.Router();
const {
  register, verifyOtp, login, resendOtp, forgotPassword, resetPassword,
  registerValidation, loginValidation, otpValidation,
} = require('../controllers/authController');
const { authLimiter, otpResendLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

// POST /api/auth/register
router.post('/register', authLimiter, registerValidation, validate, register);

// POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, otpValidation, validate, verifyOtp);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, validate, login);

// POST /api/auth/resend-otp
router.post('/resend-otp', otpResendLimiter, resendOtp);

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;
