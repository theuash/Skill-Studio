const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    acceptanceCriteria: {
      type: [String],
      default: [],
    },
    bonusFeatures: {
      type: [String],
      default: [],
    },
    estimatedDays: {
      type: Number,
      default: 14,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    repoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'analyzing', 'analyzed', 'failed'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1 });
projectSchema.index({ roadmapId: 1 });

module.exports = mongoose.model('Project', projectSchema);
