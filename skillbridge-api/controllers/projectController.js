const { body } = require('express-validator');
const Project = require('../models/Project');
const Roadmap = require('../models/Roadmap');
const Company = require('../models/Company');
const Analysis = require('../models/Analysis');
const { generateProject } = require('../utils/aiService');
const { analyzeRepository, parseGitHubUrl } = require('../utils/repoAnalyzer');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── Validation ──────────────────────────────────────────────────────────────

const generateValidation = [
  body('roadmapId').notEmpty().withMessage('Roadmap ID is required'),
];

const submitValidation = [
  body('projectId')
    .notEmpty().withMessage('Project ID is required')
    .isMongoId().withMessage('Project ID must be a valid Mongo ID'),
  body('repoUrl')
    .notEmpty().withMessage('Repository URL is required')
    .isURL({ protocols: ['https'], require_protocol: true })
    .withMessage('Must be a valid HTTPS URL')
    .custom((url) => {
      if (!url.includes('github.com')) {
        throw new Error('Only GitHub repository URLs are supported');
      }
      return true;
    }),
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/project/generate  (protected)
 */
const generateProjectHandler = asyncHandler(async (req, res) => {
  const { roadmapId } = req.body;
  const userId = req.user._id;

  // Fetch roadmap with company data
  const roadmap = await Roadmap.findOne({ _id: roadmapId, userId })
    .populate('companyId', 'name sector tagline requiredSkills');

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: 'Roadmap not found or access denied.',
    });
  }

  // Check if project already exists
  const existingProject = await Project.findOne({ roadmapId, userId });
  if (existingProject) {
    return res.status(200).json({
      success: true,
      message: 'Project brief already generated for this roadmap.',
      data: { project: existingProject, isExisting: true },
    });
  }

  // Check progress threshold (must be >= 50%)
  if (roadmap.progress < 50) {
    return res.status(400).json({
      success: false,
      message: `Complete at least 50% of the roadmap before generating a project brief. Current progress: ${roadmap.progress}%.`,
    });
  }

  const company = roadmap.companyId;
  const completedNodes = roadmap.nodes.filter((n) => n.completed);
  const allSkills = company.requiredSkills.map((s) => s.skill);

  console.log(`🤖 Generating project for ${roadmap.jobRole} at ${company.name}...`);

  const projectData = await generateProject({
    companyName: company.name,
    jobRole: roadmap.jobRole,
    sector: company.sector,
    skills: allSkills,
    completedNodes,
  });

  const project = await Project.create({
    userId,
    roadmapId: roadmap._id,
    ...projectData,
    status: 'pending',
  });

  return res.status(201).json({
    success: true,
    message: 'Project brief generated! Time to build something great.',
    data: { project, isExisting: false },
  });
});

/**
 * POST /api/project/brief  (protected)
 * Generate a project brief for a company without needing roadmap progress.
 */
const generateProjectBrief = asyncHandler(async (req, res) => {
  const { companyId, jobRole = 'Software Engineer' } = req.body;
  const userId = req.user._id;

  // Avoid casting errors if companyId is not a Mongo ObjectId
  const normalized = String(companyId).toLowerCase();
  const companyQuery = [
    { companyId: normalized },
    { companyId: { $regex: `^${String(normalized).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}` } },
  ];
  if (require('mongoose').Types.ObjectId.isValid(companyId)) {
    companyQuery.push({ _id: companyId });
  }
  const company = await Company.findOne({ $or: companyQuery }).lean();

  if (!company) {
    return res.status(404).json({
      success: false,
      message: `Company '${companyId}' not found.`,
    });
  }

  // Ensure we have a roadmap record to associate with this project
  let roadmap = await Roadmap.findOne({ userId, companyId: company._id, jobRole });
  if (!roadmap) {
    roadmap = await Roadmap.create({
      userId,
      companyId: company._id,
      jobRole,
      nodes: [],
      progress: 0,
      knownSkills: [],
    });
  }

  // Return existing project if already generated for this roadmap
  const existingProject = await Project.findOne({ roadmapId: roadmap._id, userId });
  if (existingProject) {
    return res.status(200).json({
      success: true,
      message: 'Project brief already generated for this company.',
      data: { project: existingProject, isExisting: true },
    });
  }

  const skills = company.requiredSkills.map((s) => s.skill);

  console.log(`🤖 Generating project brief for ${jobRole} at ${company.name}...`);

  const projectData = await generateProject({
    companyName: company.name,
    jobRole,
    sector: company.sector,
    skills,
    completedNodes: [],
  });

  const project = await Project.create({
    userId,
    roadmapId: roadmap._id,
    ...projectData,
    status: 'pending',
  });

  return res.status(201).json({
    success: true,
    message: 'Project brief generated! You can submit a GitHub repo to analyze it.',
    data: { project, isExisting: false },
  });
});

/**
 * POST /api/project/submit  (protected)
 */
const submitProject = asyncHandler(async (req, res) => {
  const { projectId, repoUrl } = req.body;
  const userId = req.user._id;

  // Validate GitHub URL parse
  try {
    parseGitHubUrl(repoUrl);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  const project = await Project.findOne({ _id: projectId, userId })
    .populate({
      path: 'roadmapId',
      select: 'jobRole companyId nodes',
      populate: { path: 'companyId', select: 'name sector' },
    });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found or access denied.',
    });
  }

  if (project.status === 'analyzed') {
    return res.status(400).json({
      success: false,
      message: 'This project has already been analyzed.',
    });
  }

  // Update project
  project.repoUrl = repoUrl;
  project.status = 'submitted';
  project.submittedAt = new Date();
  await project.save();

  // Trigger async analysis (non-blocking)
  setImmediate(() => runAnalysis(project, userId));

  return res.status(200).json({
    success: true,
    message: 'Project submitted successfully. AI analysis has started — check back in a moment.',
    data: {
      project: {
        _id: project._id,
        status: project.status,
        repoUrl: project.repoUrl,
        submittedAt: project.submittedAt,
      },
    },
  });
});

/**
 * Async background analysis runner
 */
const runAnalysis = async (project, userId) => {
  try {
    console.log(`🔍 Starting analysis for project ${project._id}...`);

    // Mark as analyzing
    await Project.findByIdAndUpdate(project._id, { status: 'analyzing' });

    const roadmap = project.roadmapId;
    const company = roadmap?.companyId;

    const analysisData = await analyzeRepository(project.repoUrl, {
      title: project.title,
      description: project.description,
      jobRole: roadmap?.jobRole || 'Software Engineer',
      techStack: project.techStack,
      acceptanceCriteria: project.acceptanceCriteria,
    });

    // Save analysis
    await Analysis.create({
      userId,
      projectId: project._id,
      repoUrl: project.repoUrl,
      ...analysisData,
    });

    // Mark project as analyzed
    await Project.findByIdAndUpdate(project._id, { status: 'analyzed' });

    console.log(`✅ Analysis complete for project ${project._id} — Score: ${analysisData.overallScore}`);
  } catch (err) {
    console.error(`❌ Analysis failed for project ${project._id}:`, err.message);
    await Project.findByIdAndUpdate(project._id, { status: 'failed' });
  }
};

/**
 * GET /api/project/:projectId  (protected)
 */
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.projectId,
    userId: req.user._id,
  }).populate({
    path: 'roadmapId',
    select: 'jobRole progress',
    populate: { path: 'companyId', select: 'name domain logo' },
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found or access denied.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Project fetched successfully',
    data: { project },
  });
});

/**
 * GET /api/project/:projectId/analysis  (protected)
 */
const getAnalysis = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.projectId,
    userId: req.user._id,
  }).select('status title repoUrl submittedAt');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found or access denied.',
    });
  }

  if (project.status === 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Project has not been submitted yet.',
    });
  }

  if (project.status === 'submitted' || project.status === 'analyzing') {
    return res.status(202).json({
      success: true,
      message: 'Analysis is in progress. Check back in a moment.',
      data: { status: 'processing' },
    });
  }

  if (project.status === 'failed') {
    return res.status(500).json({
      success: false,
      message: 'Analysis failed. Please try resubmitting your project.',
      data: { status: 'failed' },
    });
  }

  const analysis = await Analysis.findOne({ projectId: req.params.projectId })
    .populate('projectId', 'title techStack repoUrl submittedAt');

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Analysis fetched successfully',
    data: { analysis, status: 'analyzed' },
  });
});

/**
 * GET /api/project  (protected) — list user's projects
 */
const getUserProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id })
    .populate({
      path: 'roadmapId',
      select: 'jobRole',
      populate: { path: 'companyId', select: 'name domain logo' },
    })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: 'Projects fetched successfully',
    data: { projects, total: projects.length },
  });
});

module.exports = {
  generateProjectHandler,
  generateProjectBrief,
  submitProject,
  getProject,
  getAnalysis,
  getUserProjects,
  generateValidation,
  submitValidation,
};
