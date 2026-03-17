const mongoose = require('mongoose')

const newsDailySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  headline: {
    type: String,
    required: true
  },
  articles: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    sector: {
      type: String,
      required: true,
      enum: ['Tech', 'Finance', 'Healthcare', 'Education', 'Manufacturing']
    },
    category: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low']
    },
    readTime: {
      type: String,
      required: true
    },
    tags: [{
      type: String
    }],
    expandedContent: {
      type: Object,
      default: null
    }
  }],
  trendingSkills: [{
    skill: {
      type: String,
      required: true
    },
    trend: {
      type: String,
      required: true,
      enum: ['Rising', 'Declining', 'Stable']
    },
    demandScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  sectorSummary: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
newsDailySchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('NewsDaily', newsDailySchema)