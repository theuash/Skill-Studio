const Job = require('../models/Job')
const User = require('../models/User')
const Company = require('../models/Company')
const { getJobsFromMock, getJobById: getJobByIdFromMock } = require('../services/jobsService')

// Get all jobs with filtering
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      experienceLevel,
      location,
      sector,
      exclude,
      tags
    } = req.query

    let query = { isActive: true }

    // Search filter
    if (search) {
      query.$text = { $search: search }
    }

    // Sector filter
    if (sector) {
      query.sector = sector
    }

    // Type filter
    if (type) {
      query.type = { $in: type.split(',') }
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = { $in: experienceLevel.split(',') }
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    // Tags filter
    if (tags) {
      query.tags = { $in: tags.split(',') }
    }

    // Exclude a specific job (for similar jobs list)
    if (exclude) {
      query._id = { $ne: exclude }
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip((page - 1) * limit)
      .select('-__v')

    console.log('Database jobs found:', jobs.length)

    // If no jobs in database, use mock jobs
    let jobsToReturn = jobs
    let total = await Job.countDocuments(query)

    if (jobs.length === 0) {
      console.log('No database jobs, using mock jobs')
      const mockJobs = getJobsFromMock({
        search,
        type,
        experienceLevel,
        location,
        exclude,
      })
      const paginatedMock = mockJobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice((parseInt(page, 10) - 1) * parseInt(limit, 10), parseInt(page, 10) * parseInt(limit, 10))
      jobsToReturn = paginatedMock
      total = mockJobs.length
    } else {
      // Attach company metadata when available
      const companyNames = [...new Set(jobs.map((j) => j.company).filter(Boolean))]
      const companies = await Company.find({ name: { $in: companyNames } }).lean()
      const companyMap = new Map(companies.map((c) => [c.name, c]))

      jobsToReturn = jobs.map((job) => {
        const companyDoc = companyMap.get(job.company)
        return {
          ...job.toObject(),
          company: companyDoc
            ? {
                _id: companyDoc._id,
                name: companyDoc.name,
                domain: companyDoc.domain,
                logo: companyDoc.logo,
                website: companyDoc.website || '',
                description: companyDoc.description,
                location: companyDoc.location,
                size: companyDoc.size,
                founded: companyDoc.founded,
              }
            : job.company,
        }
      })
    }

    res.json({
      success: true,
      data: {
        jobs: jobsToReturn,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    // Fallback to mock jobs on any error
    try {
      const mockJobs = getJobsFromMock({})
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 20
      const paginatedMock = mockJobs.slice((page - 1) * limit, page * limit)
      return res.json({
        success: true,
        data: {
          jobs: paginatedMock,
          pagination: {
            page,
            limit,
            total: mockJobs.length,
            pages: Math.ceil(mockJobs.length / limit),
          },
        },
      })
    } catch {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }
}

// Get job count for sidebar badge
const getJobsCount = async (req, res) => {
  try {
    let count = await Job.countDocuments({ isActive: true })
    
    // If no database jobs, return count of mock jobs
    if (count === 0) {
      const { generateMockJobs } = require('../services/jobsService')
      const mockJobs = generateMockJobs()
      count = mockJobs.length
    }

    res.json({ success: true, data: { count } })
  } catch (error) {
    console.error('Error fetching jobs count:', error)
    // Return mock jobs count as fallback
    const { generateMockJobs } = require('../services/jobsService')
    const mockJobs = generateMockJobs()
    res.json({ success: true, data: { count: mockJobs.length } })
  }
}

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params

    console.log('Looking for job ID:', jobId)

    // Try to find in database first
    let job = null
    let isMockData = false

    try {
      job = await Job.findById(jobId).lean()
    } catch (e) {
      console.log('Invalid ObjectId, trying mock data')
    }

    // If not found in database, try mock data
    if (!job) {
      console.log('Not found in DB, checking mock data')
      job = getJobByIdFromMock(jobId)
      isMockData = true
    }

    if (!job) {
      return res.status(404).json({ success: false, error: `Job with ID ${jobId} not found` })
    }

    console.log('Found job:', job.title)

    let company = null
    if (!isMockData) {
      company = await Company.findOne({
        $or: [{ name: job.company }, { domain: job.company }, { companyId: job.company }],
      }).lean()
    }

    const formatted = {
      _id: job._id,
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      salaryRange: job.salary || job.salaryRange,
      requiredSkills: job.requiredSkills || (job.requirements || []).map((req) => ({
        skill: req,
        level: 'Intermediate',
      })),
      postedAt: job.postedAt || job.createdAt,
      applicantCount: job.applicantCount || job.applicants || 0,
      sector: job.sector || null,
      tags: job.tags || [],
      companyUrl: job.companyUrl || company?.website || '',
      company: job.company || (company
        ? {
            _id: company._id,
            name: company.name,
            domain: company.domain,
            logo: company.logo,
            sector: company.sector,
            description: company.description,
            website: company.website || '',
            location: company.location || '',
            size: company.size || '',
            founded: company.founded || null,
          }
        : {
            name: job.company,
          }),
      experienceLevel: job.experienceLevel || 'Mid Level',
    }

    res.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Save/unsave job for user
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user.id

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const user = await User.findById(userId)

    if (user.savedJobs.includes(jobId)) {
      // Remove from saved jobs
      user.savedJobs = user.savedJobs.filter(id => id !== jobId)
      await user.save()
      res.json({ message: 'Job removed from saved jobs', saved: false })
    } else {
      // Add to saved jobs
      user.savedJobs.push(jobId)
      await user.save()
      res.json({ message: 'Job saved successfully', saved: true })
    }
  } catch (error) {
    console.error('Error saving job:', error)
    res.status(500).json({
      message: 'Failed to save job',
      error: error.message
    })
  }
}

// Get user's saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).populate('savedJobs')

    res.json({
      savedJobs: user.savedJobs.map(job => job._id.toString())
    })
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
    res.status(500).json({
      message: 'Failed to fetch saved jobs',
      error: error.message
    })
  }
}

// Get user's saved jobs with full details
const getSavedJobsDetails = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).populate('savedJobs')

    res.json({
      jobs: user.savedJobs
    })
  } catch (error) {
    console.error('Error fetching saved jobs details:', error)
    res.status(500).json({
      message: 'Failed to fetch saved jobs details',
      error: error.message
    })
  }
}

// Create a new job (admin function - could be used for seeding)
const createJob = async (req, res) => {
  try {
    const jobData = req.body

    const job = new Job(jobData)
    await job.save()

    res.status(201).json({
      message: 'Job created successfully',
      job
    })
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({
      message: 'Failed to create job',
      error: error.message
    })
  }
}

module.exports = {
  getJobs,
  getJobsCount,
  getJobById,
  saveJob,
  getSavedJobs,
  getSavedJobsDetails,
  createJob
}