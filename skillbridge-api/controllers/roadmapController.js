const { body, param } = require('express-validator');
const Roadmap = require('../models/Roadmap');
const Company = require('../models/Company');
const User = require('../models/User');
const { generateRoadmap } = require('../utils/aiService');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── Validation ──────────────────────────────────────────────────────────────

const generateValidation = [
  body('companyId').notEmpty().withMessage('Company ID is required'),
  body('jobRole').trim().notEmpty().withMessage('Job role is required'),
  body('knownSkills').optional().isArray().withMessage('knownSkills must be an array'),
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/roadmap/generate  (protected)
 * Generate an AI roadmap for a company + job role
 */
const generateRoadmapHandler = asyncHandler(async (req, res) => {
  const { companyId, jobRole, knownSkills = [] } = req.body;
  const userId = req.user._id;

  // Fetch company
  const company = await Company.findOne({
    $or: [
      { companyId: companyId.toLowerCase() },
      { _id: companyId },
    ],
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: `Company '${companyId}' not found.`,
    });
  }

  // Check for existing roadmap for this user/company/role
  const existingRoadmap = await Roadmap.findOne({ userId, companyId: company._id, jobRole });
  if (existingRoadmap) {
    return res.status(200).json({
      success: true,
      message: 'Roadmap already exists for this company and role.',
      data: { roadmap: existingRoadmap, isExisting: true },
    });
  }

  // Call AI service
  console.log(`🤖 Generating roadmap for ${jobRole} at ${company.name}...`);
  const nodes = await generateRoadmap({
    companyName: company.name,
    sector: company.sector,
    jobRole,
    requiredSkills: company.requiredSkills,
    knownSkills,
  });

  // Mark known skills as completed
  const normalizedKnown = knownSkills.map((s) => s.toLowerCase().trim());
  const processedNodes = nodes.map((node) => ({
    ...node,
    completed:
      node.completed ||
      normalizedKnown.some((known) => node.title.toLowerCase().includes(known)),
    completedAt: node.completed ? new Date() : null,
  }));

  // Calculate initial progress
  const completedCount = processedNodes.filter((n) => n.completed).length;
  const progress = processedNodes.length
    ? Math.round((completedCount / processedNodes.length) * 100)
    : 0;

  const roadmap = await Roadmap.create({
    userId,
    companyId: company._id,
    jobRole,
    nodes: processedNodes,
    progress,
    knownSkills,
  });

  // Add skills to user profile
  if (knownSkills.length > 0) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { skillsLearned: { $each: knownSkills } },
    });
  }

  const populated = await Roadmap.findById(roadmap._id)
    .populate('companyId', 'name domain logo sector tagline')
    .lean();

  return res.status(201).json({
    success: true,
    message: `Roadmap generated! ${processedNodes.length} learning nodes created.`,
    data: { roadmap: populated, isExisting: false },
  });
});

/**
 * GET /api/roadmap/:roadmapId  (protected)
 */
const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({
    _id: req.params.roadmapId,
    userId: req.user._id,
  }).populate('companyId', 'name domain logo sector tagline requiredSkills');

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: 'Roadmap not found or access denied.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Roadmap fetched successfully',
    data: { roadmap },
  });
});

/**
 * GET /api/roadmap  (protected) — list user's roadmaps
 */
const getUserRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ userId: req.user._id, isActive: true })
    .populate('companyId', 'name domain logo sector tagline')
    .select('-nodes')
    .sort({ updatedAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: 'Roadmaps fetched successfully',
    data: { roadmaps, total: roadmaps.length },
  });
});

/**
 * PUT /api/roadmap/:roadmapId/node/:nodeId  (protected)
 * Toggle node completed status
 */
const toggleNode = asyncHandler(async (req, res) => {
  const { roadmapId, nodeId } = req.params;

  const roadmap = await Roadmap.findOne({
    _id: roadmapId,
    userId: req.user._id,
  });

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: 'Roadmap not found or access denied.',
    });
  }

  const node = roadmap.nodes.find((n) => n.nodeId === nodeId);
  if (!node) {
    return res.status(404).json({
      success: false,
      message: `Node '${nodeId}' not found in this roadmap.`,
    });
  }

  // Toggle
  node.completed = !node.completed;
  node.completedAt = node.completed ? new Date() : null;

  // Recalculate progress
  roadmap.recalculateProgress();
  await roadmap.save();

  // Update user skills when a node is completed
  if (node.completed) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { skillsLearned: node.title },
    });
  }

  return res.status(200).json({
    success: true,
    message: `Node marked as ${node.completed ? 'completed' : 'incomplete'}.`,
    data: {
      nodeId,
      completed: node.completed,
      progress: roadmap.progress,
      completedAt: node.completedAt,
    },
  });
});

/**
 * DELETE /api/roadmap/:roadmapId  (protected)
 */
const deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOneAndUpdate(
    { _id: req.params.roadmapId, userId: req.user._id },
    { isActive: false },
    { new: true }
  );

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: 'Roadmap not found or access denied.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Roadmap removed from your list.',
  });
});

module.exports = {
  generateRoadmapHandler,
  getRoadmap,
  getUserRoadmaps,
  toggleNode,
  deleteRoadmap,
  generateValidation,
};
