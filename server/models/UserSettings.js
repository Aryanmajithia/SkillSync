const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
  },
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: true,
    },
    jobAlerts: {
      type: Boolean,
      default: true,
    },
    applicationUpdates: {
      type: Boolean,
      default: true,
    },
    interviewReminders: {
      type: Boolean,
      default: true,
    },
  },
  emailNotifications: {
    applications: {
      type: Boolean,
      default: true,
    },
    interviews: {
      type: Boolean,
      default: true,
    },
    statusUpdates: {
      type: Boolean,
      default: true,
    },
    jobMatches: {
      type: Boolean,
      default: true,
    },
    weeklyDigest: {
      type: Boolean,
      default: true,
    },
  },
  preferences: {
    jobSearch: {
      preferredLocations: [String],
      preferredRoles: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
      remotePreference: {
        type: String,
        enum: ["remote", "hybrid", "onsite", "any"],
        default: "any",
      },
      experienceLevel: {
        type: String,
        enum: ["entry", "mid", "senior", "any"],
        default: "any",
      },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "private", "connections"],
        default: "public",
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
    },
  },
  features: {
    premiumAccess: {
      type: Boolean,
      default: false,
    },
    premiumExpiry: Date,
    enabledFeatures: [String],
    usageStats: {
      interviewsCompleted: {
        type: Number,
        default: 0,
      },
      resumeAnalyses: {
        type: Number,
        default: 0,
      },
      aiChatSessions: {
        type: Number,
        default: 0,
      },
      lastActive: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
userSettingsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
userSettingsSchema.index({ userId: 1 });
userSettingsSchema.index({ "features.premiumAccess": 1 });

module.exports = mongoose.model("UserSettings", userSettingsSchema);
