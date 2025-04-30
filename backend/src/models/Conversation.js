import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ job: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ updatedAt: -1 });

// Ensure a conversation can only have 2 participants
conversationSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    next(new Error("A conversation must have exactly 2 participants"));
  }
  next();
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
