const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "file", "image", "system"],
    default: "text",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  metadata: {
    fileName: String,
    fileSize: Number,
    fileType: String,
    url: String,
  },
});

const chatSchema = new mongoose.Schema({
  // For user-to-user messaging
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // For AI chat sessions
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sessionId: {
    type: String,
  },

  type: {
    type: String,
    enum: ["direct", "ai", "group"],
    default: "direct",
  },

  // AI chat specific fields
  aiType: {
    type: String,
    enum: ["general", "job-search", "career-advice", "interview-prep"],
  },

  messages: [messageSchema],

  lastMessage: {
    type: messageSchema,
  },

  // AI chat context
  context: {
    currentJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    userPreferences: {
      location: String,
      role: String,
      experience: String,
      salary: String,
    },
    sessionData: mongoose.Schema.Types.Mixed,
  },

  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },

  // AI chat summary
  summary: {
    topics: [String],
    keyInsights: [String],
    recommendations: [String],
  },

  // Chat metadata
  title: String,
  description: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps
chatSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.lastActivity = Date.now();
  next();
});

// Index for efficient queries
chatSchema.index({ participants: 1 });
chatSchema.index({ userId: 1, sessionId: 1 });
chatSchema.index({ userId: 1, lastActivity: -1 });
chatSchema.index({ status: 1, type: 1 });
chatSchema.index({ "messages.timestamp": -1 });

module.exports = mongoose.model("Chat", chatSchema);
