import mongoose, { Document, Schema } from "mongoose";

export interface IProposal extends Document {
  job: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  coverLetter: string;
  bid: {
    amount: number;
    type: "fixed" | "hourly";
  };
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  attachments?: string[];
  milestones?: {
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    status: "pending" | "completed" | "cancelled";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
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

export const Proposal = mongoose.model<IProposal>("Proposal", proposalSchema);
