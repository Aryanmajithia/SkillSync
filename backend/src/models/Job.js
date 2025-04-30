import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "web-development",
        "mobile-development",
        "design",
        "writing",
        "marketing",
        "other",
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "freelance"],
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ category: 1, type: 1, location: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
