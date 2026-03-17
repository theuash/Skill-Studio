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

// Get all jobs with filtering
router.get('/', getJobs)

// Get jobs count for sidebar badge
router.get('/count', getJobsCount)

// Get single job by ID
router.get('/:jobId', getJobById)

// Save/unsave a job
router.post('/saved/:jobId', saveJob)
router.delete('/saved/:jobId', saveJob)

// Get user's saved job IDs
router.get('/saved/list', getSavedJobs)

// Get user's saved jobs with full details
router.get('/saved/details', getSavedJobsDetails)

// Create a new job (admin/seeding)
router.post('/', createJob)

module.exports = router