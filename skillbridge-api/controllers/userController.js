const { body } = require('express-validator');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Project = require('../models/Project');
const Analysis = require('../models/Analysis');
const { asyncHandler } = require('../middleware/errorHandler');

const updateProfileValidation = [
  body('fullName').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('sector').optional().trim().isLength({ max: 60 }).withMessage('Sector name too long'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

/**
 * GET /api/user/profile  (protected)
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();

  const [roadmaps, projects] = await Promise.all([
    Roadmap.find({ userId: req.user._id, isActive: true })
      .populate('companyId', 'name domain logo sector tagline')
      .select('-nodes')
      .sort({ updatedAt: -1 })
      .lean(),
    Project.find({ userId: req.user._id })
      .populate({
        path: 'roadmapId',
        select: 'jobRole',
        populate: { path: 'companyId', select: 'name domain logo' },
      })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: {
      user,
      roadmaps,
      projects,
      stats: {
        roadmapsStarted: roadmaps.length,
        projectsSubmitted: projects.filter((p) => p.status !== 'pending').length,
        skillsLearned: user.skillsLearned?.length || 0,
        avgProgress: roadmaps.length
          ? Math.round(roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0) / roadmaps.length)
          : 0,
      },
    },
  });
});

/**
 * PUT /api/user/profile  (protected)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['fullName', 'sector', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields provided to update.',
    });
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

/**
 * GET /api/user/dashboard-stats  (protected)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [roadmaps, projects, analyses, user] = await Promise.all([
    Roadmap.find({ userId, isActive: true }).select('progress jobRole companyId updatedAt').lean(),
    Project.find({ userId }).select('status createdAt').lean(),
    Analysis.find({ userId }).select('overallScore createdAt').lean(),
    User.findById(userId).select('skillsLearned fullName createdAt').lean(),
  ]);

  const submittedProjects = projects.filter((p) => p.status !== 'pending');
  const analyzedProjects = projects.filter((p) => p.status === 'analyzed');

  const avgScore = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length)
    : 0;

  const avgProgress = roadmaps.length
    ? Math.round(roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0) / roadmaps.length)
    : 0;

  const completedRoadmaps = roadmaps.filter((r) => r.progress === 100);

  // Most recent activity
  const allActivity = [
    ...roadmaps.map((r) => ({ type: 'roadmap', date: r.updatedAt })),
    ...projects.map((p) => ({ type: 'project', date: p.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return res.status(200).json({
    success: true,
    message: 'Dashboard stats fetched',
    data: {
      stats: {
        roadmapsStarted: roadmaps.length,
        roadmapsCompleted: completedRoadmaps.length,
        projectsGenerated: projects.length,
        projectsSubmitted: submittedProjects.length,
        projectsAnalyzed: analyzedProjects.length,
        skillsLearned: user?.skillsLearned?.length || 0,
        avgProgress,
        avgAnalysisScore: avgScore,
        memberSince: user?.createdAt,
      },
      recentActivity: allActivity,
    },
  });
});

/**
 * GET /api/user/skills  (protected)
 */
const getUserSkills = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('skillsLearned').lean();

  return res.status(200).json({
    success: true,
    message: 'Skills fetched',
    data: { skills: user?.skillsLearned || [] },
  });
});

/**
 * DELETE /api/user/account  (protected)
 * Soft delete — mark as unverified
 */
const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isVerified: false, email: `deleted_${Date.now()}_${req.user.email}` });

  return res.status(200).json({
    success: true,
    message: 'Account deleted. We\'re sorry to see you go.',
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getUserSkills,
  deleteAccount,
  updateProfileValidation,
};
