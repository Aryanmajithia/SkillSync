import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[];
  readBy: mongoose.Types.ObjectId[];
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ status: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
