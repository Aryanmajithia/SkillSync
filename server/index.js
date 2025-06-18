const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SkillSync Backend API",
    status: "running",
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
    },
    timestamp: new Date().toISOString(),
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI ? "Set" : "Using default"
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Please check your MONGODB_URI environment variable");
  });

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/interviews", require("./routes/interviews"));
app.use("/api/resume-analysis", require("./routes/resume-analysis"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/payments", require("./routes/payments"));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
