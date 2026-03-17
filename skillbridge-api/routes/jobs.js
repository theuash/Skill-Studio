const express = require('express')
const router = express.Router()
const {
  getJobs,
  getJobsCount,
  getJobById,
  saveJob,
  getSavedJobs,
  getSavedJobsDetails,
  createJob
} = require('../controllers/jobsController')
const { protect } = require('../middleware/authMiddleware')

// All job routes require authentication
router.use(protect)

// Specific routes BEFORE wildcard routes
router.get('/count', getJobsCount)
router.get('/saved/list', getSavedJobs)
router.get('/saved/details', getSavedJobsDetails)

// Get all jobs with filtering
router.get('/', getJobs)

// Get single job by ID (must be last)
router.get('/:jobId', getJobById)

// Save/unsave a job
router.post('/saved/:jobId', saveJob)
router.delete('/saved/:jobId', saveJob)

// Create a new job (admin/seeding)
router.post('/', createJob)

module.exports = router