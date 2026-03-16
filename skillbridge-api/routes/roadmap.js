const express = require('express');
const router = express.Router();
const {
  generateRoadmapHandler,
  getRoadmap,
  getUserRoadmaps,
  toggleNode,
  deleteRoadmap,
  generateValidation,
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

// All roadmap routes are protected
router.use(protect);

// POST /api/roadmap/generate
router.post('/generate', aiLimiter, generateValidation, validate, generateRoadmapHandler);

// GET /api/roadmap  — user's all roadmaps
router.get('/', getUserRoadmaps);

// GET /api/roadmap/:roadmapId
router.get('/:roadmapId', getRoadmap);

// PUT /api/roadmap/:roadmapId/node/:nodeId  — toggle node
router.put('/:roadmapId/node/:nodeId', toggleNode);

// DELETE /api/roadmap/:roadmapId
router.delete('/:roadmapId', deleteRoadmap);

module.exports = router;
