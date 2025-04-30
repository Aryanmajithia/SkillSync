import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    bid: {
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true,
      },
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    attachments: [
      {
        type: String,
      },
    ],
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "cancelled"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ status: 1 });
proposalSchema.index({ freelancer: 1, status: 1 });

export const Proposal = mongoose.model("Proposal", proposalSchema);
