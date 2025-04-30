import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId;
  category: string;
  skills: string[];
  budget: {
    type: "fixed" | "hourly";
    amount: number;
  };
  duration: string;
  experience: "entry" | "intermediate" | "expert";
  status: "open" | "in-progress" | "completed" | "cancelled";
  proposals: mongoose.Types.ObjectId[];
  hiredFreelancer?: mongoose.Types.ObjectId;
  attachments?: string[];
  location: {
    type: "remote" | "onsite" | "hybrid";
    address?: string;
  };
  visibility: "public" | "private";
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
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
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    budget: {
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
    duration: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    proposals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
      },
    ],
    hiredFreelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        type: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
        required: true,
      },
      address: String,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ client: 1, status: 1 });
jobSchema.index({ skills: 1 });

export const Job = mongoose.model<IJob>("Job", jobSchema);
