const mongoose = require('mongoose');

const sectionScoreSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, required: true },
    summary: { type: String, default: '' },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    repoUrl: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    grade: {
      type: String,
      default: null,
    },
    codeQuality: sectionScoreSchema,
    architecture: sectionScoreSchema,
    bestPractices: sectionScoreSchema,
    testCoverage: sectionScoreSchema,
    performance: sectionScoreSchema,
    security: sectionScoreSchema,
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    nextSteps: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
    detailedReport: {
      type: String,
      default: '',
    },
    repoMetadata: {
      fileCount: { type: Number, default: 0 },
      hasReadme: { type: Boolean, default: false },
      hasTests: { type: Boolean, default: false },
      languages: { type: [String], default: [] },
      topFiles: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Convert numeric score to letter grade
analysisSchema.pre('save', function (next) {
  if (this.overallScore >= 95) this.grade = 'A+';
  else if (this.overallScore >= 90) this.grade = 'A';
  else if (this.overallScore >= 85) this.grade = 'A-';
  else if (this.overallScore >= 80) this.grade = 'B+';
  else if (this.overallScore >= 75) this.grade = 'B';
  else if (this.overallScore >= 70) this.grade = 'B-';
  else if (this.overallScore >= 65) this.grade = 'C+';
  else if (this.overallScore >= 60) this.grade = 'C';
  else this.grade = 'D';
  next();
});

module.exports = mongoose.model('Analysis', analysisSchema);
