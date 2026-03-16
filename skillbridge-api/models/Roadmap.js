const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ['video', 'article', 'docs', 'course', 'book', 'other'],
      default: 'other',
    },
  },
  { _id: false }
);

const nodeSchema = new mongoose.Schema(
  {
    nodeId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    estimatedHours: { type: Number, default: 10 },
    resources: { type: [resourceSchema], default: [] },
    prerequisites: { type: [String], default: [] },
    subTopics: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    nodes: {
      type: [nodeSchema],
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    knownSkills: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roadmapSchema.index({ userId: 1, companyId: 1 });

// Calculate progress before save
roadmapSchema.methods.recalculateProgress = function () {
  if (!this.nodes.length) {
    this.progress = 0;
    return;
  }
  const completed = this.nodes.filter((n) => n.completed).length;
  this.progress = Math.round((completed / this.nodes.length) * 100);
};

module.exports = mongoose.model('Roadmap', roadmapSchema);
