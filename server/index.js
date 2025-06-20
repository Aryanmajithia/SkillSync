const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Enhanced Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "https://skillsync-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS configuration (allow all origins for local development)
app.use(
  cors({
    origin: [
      "https://skillsync-nu.vercel.app",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SkillSync Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Root endpoint with comprehensive API information
app.get("/", (req, res) => {
  res.json({
    message: "SkillSync Backend API",
    status: "running",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV,
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      jobs: "/api/jobs",
      applications: "/api/applications",
      profile: "/api/profile",
      ai: "/api/ai",
      interviews: "/api/interviews",
      resumeAnalysis: "/api/resume-analysis",
      notifications: "/api/notifications",
      dashboard: "/api/dashboard",
      messages: "/api/messages",
      settings: "/api/settings",
      payments: "/api/payments",
      chat: "/api/chat",
    },
    features: {
      ai: process.env.ENABLE_AI_FEATURES === "true",
      email: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
      stripe: process.env.ENABLE_STRIPE_PAYMENTS === "true",
      uploads: process.env.ENABLE_FILE_UPLOADS === "true",
    },
    timestamp: new Date().toISOString(),
  });
});

// Enhanced MongoDB connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync";
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("Please check your MONGODB_URI environment variable");
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Create upload directories if they don't exist
const createUploadDirectories = () => {
  const directories = [
    "uploads",
    "uploads/chat-files",
    "uploads/resumes",
    "uploads/avatars",
    "uploads/job-attachments",
    "logs",
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

createUploadDirectories();

// API Routes with enhanced error handling
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/interviews", require("./routes/interviews"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/resume-analysis", require("./routes/resume-analysis"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/settings", require("./routes/settings"));

// Serve uploaded files with security headers
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.set("X-Content-Type-Options", "nosniff");
      res.set("X-Frame-Options", "DENY");
    },
  })
);

// Enhanced Socket.IO connection handling
const connectedUsers = new Map();
const userSessions = new Map();

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // User joins with their user ID
  socket.on("join", (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    userSessions.set(socket.id, {
      userId,
      connectedAt: new Date(),
      lastActivity: new Date(),
    });
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // Handle private messages with enhanced error handling
  socket.on("send_message", async (data) => {
    try {
      const { chatId, message, recipientId } = data;

      // Update last activity
      const session = userSessions.get(socket.id);
      if (session) {
        session.lastActivity = new Date();
      }

      // Emit to recipient if online
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", {
          chatId,
          message,
          senderId: socket.userId,
          timestamp: new Date().toISOString(),
        });
      }

      // Emit back to sender for confirmation
      socket.emit("message_sent", {
        chatId,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicators
  socket.on("typing_start", (data) => {
    try {
      const { chatId, recipientId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user_typing", {
          chatId,
          userId: socket.userId,
        });
      }
    } catch (error) {
      console.error("Error handling typing start:", error);
    }
  });

  socket.on("typing_stop", (data) => {
    try {
      const { chatId, recipientId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user_stopped_typing", {
          chatId,
          userId: socket.userId,
        });
      }
    } catch (error) {
      console.error("Error handling typing stop:", error);
    }
  });

  // Handle read receipts
  socket.on("mark_read", (data) => {
    try {
      const { chatId, messageId, recipientId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message_read", {
          chatId,
          messageId,
          readBy: socket.userId,
          readAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error handling read receipt:", error);
    }
  });

  // Handle disconnection with cleanup
  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      userSessions.delete(socket.id);
      console.log(`👋 User ${socket.userId} disconnected`);
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Log error details
  const errorDetails = {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  };

  // Log to file in production
  if (process.env.NODE_ENV === "production") {
    fs.appendFileSync("./logs/error.log", JSON.stringify(errorDetails) + "\n");
  }

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.log("✅ HTTP server closed");

    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 SkillSync Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API docs: http://localhost:${PORT}/`);
});

module.exports = { app, server, io };
