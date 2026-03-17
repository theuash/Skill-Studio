const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats,
  getUserSkills,
  getLearningProgress,
  deleteAccount,
  updateProfileValidation,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

router.use(protect);

// GET /api/user/profile
router.get('/profile', getProfile);

// PUT /api/user/profile
router.put('/profile', updateProfileValidation, validate, updateProfile);

// GET /api/user/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// GET /api/user/learning-progress
router.get('/learning-progress', getLearningProgress);

// GET /api/user/skills
router.get('/skills', getUserSkills);

// DELETE /api/user/account
router.delete('/account', deleteAccount);

module.exports = router;
