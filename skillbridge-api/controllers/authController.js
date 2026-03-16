const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken } = require('../middleware/authMiddleware');
const { sendOtpEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── Validation Rules ────────────────────────────────────────────────────────

const registerValidation = [
  body('fullName').trim().isLength({ min: 2, max: 80 }).withMessage('Full name must be 2–80 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const otpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateOTP = () => {
  // Cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
};

const createAndSendOTP = async (email, fullName, type = 'email_verify') => {
  // Remove any existing OTPs for this email + type
  await OTP.deleteMany({ email, type });

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, otp, fullName);
  return otp;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check if verified user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }
    // Unverified user — update their info and resend OTP
    existingUser.fullName = fullName;
    existingUser.password = password; // will be hashed by pre-save hook
    await existingUser.save();
    await createAndSendOTP(email, fullName);
    return res.status(200).json({
      success: true,
      message: 'OTP resent. Please check your email to verify your account.',
    });
  }

  // Create new user (password hashed via pre-save hook)
  await User.create({ fullName, email, password });
  await createAndSendOTP(email, fullName);

  return res.status(201).json({
    success: true,
    message: 'Account created! Please check your email for a 6-digit verification code.',
  });
});

/**
 * POST /api/auth/verify-otp
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const otpDoc = await OTP.findOne({ email, type: 'email_verify' });
  if (!otpDoc) {
    return res.status(400).json({
      success: false,
      message: 'No OTP found for this email. Please register or request a new OTP.',
    });
  }

  if (otpDoc.isExpired()) {
    await OTP.deleteOne({ _id: otpDoc._id });
    return res.status(400).json({
      success: false,
      message: 'OTP has expired. Please request a new one.',
    });
  }

  // Track failed attempts
  if (otpDoc.otp !== otp) {
    otpDoc.attempts += 1;
    if (otpDoc.attempts >= 5) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.',
      });
    }
    await otpDoc.save();
    return res.status(400).json({
      success: false,
      message: `Incorrect OTP. ${5 - otpDoc.attempts} attempts remaining.`,
    });
  }

  // OTP correct — verify user
  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register again.',
    });
  }

  await OTP.deleteOne({ _id: otpDoc._id });

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: 'Email verified successfully! Welcome to SkillBridge.',
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
        sector: user.sector,
        skillsLearned: user.skillsLearned,
      },
    },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email not verified. Please check your inbox for the OTP.',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: `Welcome back, ${user.fullName.split(' ')[0]}!`,
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
        sector: user.sector,
        skillsLearned: user.skillsLearned,
      },
    },
  });
});

/**
 * POST /api/auth/resend-otp
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Return success anyway to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: 'If that email exists, a new OTP has been sent.',
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'This email is already verified. Please log in.',
    });
  }

  await createAndSendOTP(email, user.fullName);

  return res.status(200).json({
    success: true,
    message: 'New OTP sent to your email. It expires in 10 minutes.',
  });
});

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = await User.findOne({ email });

  // Always return success to prevent enumeration
  if (!user || !user.isVerified) {
    return res.status(200).json({
      success: true,
      message: 'If that email is registered and verified, a reset link has been sent.',
    });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendPasswordResetEmail(email, resetUrl, user.fullName);
  } catch (emailErr) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Failed to send reset email. Please try again.');
  }

  return res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email.',
  });
});

/**
 * POST /api/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token. Please request a new one.',
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const authToken = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully. You are now logged in.',
    data: { token: authToken },
  });
});

module.exports = {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  registerValidation,
  loginValidation,
  otpValidation,
};
