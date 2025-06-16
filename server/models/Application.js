const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
    },
    portfolio: String,
    availability: {
      type: String,
      required: true,
    },
    expectedSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "interview", "accepted", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    employerNotes: {
      type: String,
    },
    // Track application views and interactions
    viewedByEmployer: {
      type: Boolean,
      default: false,
    },
    viewedAt: {
      type: Date,
    },
    // Application scoring (for AI recommendations)
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    skillsMatch: [String],
    skillsGap: [String],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
