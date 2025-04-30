import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ status: 1, createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
