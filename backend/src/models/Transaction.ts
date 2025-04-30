import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod?: {
    type: "credit_card" | "bank_transfer" | "paypal" | "stripe";
    details: {
      [key: string]: any;
    };
  };
  job?: mongoose.Types.ObjectId;
  description: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "payment", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ["credit_card", "bank_transfer", "paypal", "stripe"],
      },
      details: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ job: 1 });

// Ensure amount is positive
transactionSchema.pre("save", function (next) {
  if (this.amount <= 0) {
    next(new Error("Transaction amount must be positive"));
  }
  next();
});

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
