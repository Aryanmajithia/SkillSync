import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import mongoose from "mongoose";

// Load environment variables
config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import jobRoutes from "./routes/jobs.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/jobs", jobRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
