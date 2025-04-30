import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
      enum: ["user", "admin"],
      default: "user",
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
          type: mongoose.Schema.Types.ObjectId,
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
    createdAt: {
      type: Date,
      default: Date.now,
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
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
