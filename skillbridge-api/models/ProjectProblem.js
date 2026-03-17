const mongoose = require('mongoose');

const projectProblemSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      required: true,
    },
    skills: [
      {
        name: String,
        level: String,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    technicalRequirements: [
      {
        skill: String,
        requirement: String,
      },
    ],
    acceptanceCriteria: [String],
    deliverables: [String],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectProblem', projectProblemSchema);
