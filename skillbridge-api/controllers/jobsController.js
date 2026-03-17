const Job = require('../models/Job')
const User = require('../models/User')
const Company = require('../models/Company')

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

    console.log('Jobs found:', jobs.length)

    const total = await Job.countDocuments(query)

    // Attach company metadata when available
    const companyNames = [...new Set(jobs.map((j) => j.company).filter(Boolean))]
    const companies = await Company.find({ name: { $in: companyNames } }).lean()
    const companyMap = new Map(companies.map((c) => [c.name, c]))

    const jobsWithCompany = jobs.map((job) => {
      const companyDoc = companyMap.get(job.company)
      return {
        ...job,
        company: companyDoc
          ? {
              _id: companyDoc._id,
              name: companyDoc.name,
              website: companyDoc.website || '',
              description: companyDoc.description,
              location: companyDoc.location,
              size: companyDoc.size,
              founded: companyDoc.founded,
            }
          : job.company,
      }
    })

    res.json({
      success: true,
      data: {
        jobs: jobsWithCompany,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Get job count for sidebar badge
const getJobsCount = async (req, res) => {
  try {
    const count = await Job.countDocuments({ isActive: true })
    res.json({ success: true, data: { count } })
  } catch (error) {
    console.error('Error fetching jobs count:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params

    console.log('Looking for job ID:', jobId)
    console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(jobId))

    const job = await Job.findById(jobId).lean()

    console.log('Found job:', job ? job.title : 'NOT FOUND')

    if (!job) {
      return res.status(404).json({ success: false, error: `Job with ID ${jobId} not found in database` })
    }

    const company = await Company.findOne({
      $or: [{ name: job.company }, { domain: job.company }, { companyId: job.company }],
    }).lean()

    const formatted = {
      _id: job._id,
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      salaryRange: job.salary,
      requiredSkills: (job.requirements || []).map((req) => ({
        name: req,
        level: 'Intermediate',
      })),
      postedAt: job.postedAt || job.createdAt,
      applicantCount: job.applicants || 0,
      sector: job.sector || null,
      tags: job.tags || [],
      companyUrl: company?.website || '',
      company: company
        ? {
            _id: company._id,
            name: company.name,
            sector: company.sector,
            description: company.description,
            website: company.website || '',
            location: company.location || '',
            size: company.size || '',
            founded: company.founded || null,
          }
        : {
            name: job.company,
          },
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