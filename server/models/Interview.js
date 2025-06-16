const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  jobTitle: String,
  company: String,
  interviewer: String,
  scheduledAt: Date,
  duration: Number,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "pending", "premium-pending"],
    default: "pending",
  },
  // Premium fields
  isPremium: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "pending", "paid", "failed"],
    default: "unpaid",
  },
  stripeSessionId: String,
  premiumFeatures: {
    aiFeedback: { type: Boolean, default: false },
    downloadableReport: { type: Boolean, default: false },
    followUp: { type: Boolean, default: false },
  },
  // Interview results
  technicalScore: Number,
  communicationScore: Number,
  problemSolvingScore: Number,
  culturalFitScore: Number,
  strengths: [String],
  areasForImprovement: [String],
  technicalQuestions: [String],
  technicalResponses: [String],
  technicalFeedback: String,
  communicationFeedback: String,
  detailedFeedback: String,
  interviewNotes: [String],
  followUpActions: [String],
  skillRecommendations: [String],
  resources: [String],
  nextSteps: [
    {
      title: String,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
interviewSchema.index({ userId: 1, jobId: 1 });
interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ isPremium: 1, paymentStatus: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
