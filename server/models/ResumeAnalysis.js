const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: false, // Optional for general analysis
  },
  resumeContent: {
    type: String,
    required: true,
  },
  analysisType: {
    type: String,
    enum: ["general", "job-specific"],
    default: "general",
  },
  atsScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
    },
    keywordMatch: {
      type: Number,
      min: 0,
      max: 100,
    },
    formatting: {
      type: Number,
      min: 0,
      max: 100,
    },
    readability: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  keywordAnalysis: {
    matched: [String],
    missing: [String],
    suggested: [String],
  },
  improvements: [
    {
      category: {
        type: String,
        enum: ["content", "formatting", "keywords", "structure"],
      },
      suggestion: String,
      priority: {
        type: String,
        enum: ["high", "medium", "low"],
      },
      impact: String,
    },
  ],
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  aiAnalysis: {
    summary: String,
    detailedFeedback: String,
    actionItems: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
resumeAnalysisSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });
resumeAnalysisSchema.index({ jobId: 1, userId: 1 });

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
