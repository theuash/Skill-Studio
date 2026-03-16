const express = require('express');
const router = express.Router();
const {
  generateProjectHandler,
  submitProject,
  getProject,
  getAnalysis,
  getUserProjects,
  generateValidation,
  submitValidation,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

router.use(protect);

// POST /api/project/generate
router.post('/generate', aiLimiter, generateValidation, validate, generateProjectHandler);

// POST /api/project/submit
router.post('/submit', submitValidation, validate, submitProject);

// GET /api/project  — list user projects
router.get('/', getUserProjects);

// GET /api/project/:projectId
router.get('/:projectId', getProject);

// GET /api/project/:projectId/analysis
router.get('/:projectId/analysis', getAnalysis);

module.exports = router;
