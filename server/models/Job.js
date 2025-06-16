const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  skills: [String],
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "freelance", "internship"],
    required: true,
  },
  experience: {
    type: String,
    enum: ["entry", "mid", "senior", "lead", "executive"],
    required: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
