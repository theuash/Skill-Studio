const mongoose = require('mongoose');

const projectAnalysisSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectProblem',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    overallResult: {
      type: String,
      enum: ['PASS', 'FAIL', 'PARTIAL'],
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    summary: String,
    skillResults: [
      {
        skill: String,
        status: {
          type: String,
          enum: ['PASS', 'FAIL', 'NEEDS_IMPROVEMENT'],
        },
        score: Number,
        feedback: String,
        improvements: [String],
      },
    ],
    criteriaResults: [
      {
        criterion: String,
        met: Boolean,
        comment: String,
      },
    ],
    strengths: [String],
    weaknesses: [String],
    overallFeedback: String,
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectAnalysis', projectAnalysisSchema);
