const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  salary: {
    type: String,
    trim: true
  },
  requirements: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  applicants: {
    type: Number,
    default: 0
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  applicationDeadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'SkillBridge'
  },
  externalUrl: {
    type: String
  },
  sector: {
    type: String,
    default: 'Tech'
  }
}, {
  timestamps: true
})

// Index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text', tags: 'text' })

module.exports = mongoose.model('Job', jobSchema)