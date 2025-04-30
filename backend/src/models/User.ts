import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "freelancer" | "client";
  avatar?: string;
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  availability?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  wallet: {
    balance: number;
    transactions: mongoose.Types.ObjectId[];
  };
  subscription: {
    plan: "free" | "basic" | "premium";
    status: "active" | "inactive" | "cancelled";
    startDate: Date;
    endDate?: Date;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["freelancer", "client"],
      required: true,
    },
    avatar: {
      type: String,
    },
    skills: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    hourlyRate: {
      type: Number,
    },
    availability: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "inactive",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
