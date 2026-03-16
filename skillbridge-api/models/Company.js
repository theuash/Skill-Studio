const mongoose = require('mongoose');

const requiredSkillSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    category: { type: String, default: null },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: function () {
        return `https://logo.clearbit.com/${this.domain}`;
      },
    },
    sector: {
      type: String,
      required: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    jobRoles: {
      type: [String],
      required: true,
    },
    requiredSkills: {
      type: [requiredSkillSchema],
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    size: {
      type: String,
      enum: ['startup', 'mid-size', 'large', 'enterprise'],
      default: 'large',
    },
    interviewDifficulty: {
      type: String,
      enum: ['medium', 'hard', 'very-hard'],
      default: 'hard',
    },
  },
  { timestamps: true }
);

companySchema.index({ sector: 1 });

module.exports = mongoose.model('Company', companySchema);
