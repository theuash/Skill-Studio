const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateProblem,
  analyzeProject,
  getMyProjects,
  generateCustomProblem,
} = require('../controllers/projectsController');

// POST /api/projects/generate-problem
router.post('/generate-problem', protect, generateProblem);

// POST /api/projects/generate-custom
router.post('/generate-custom', protect, generateCustomProblem);

// POST /api/projects/analyze
router.post('/analyze', protect, analyzeProject);

// GET /api/projects/my-projects
router.get('/my-projects', protect, getMyProjects);

module.exports = router;
