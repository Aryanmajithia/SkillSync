const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const fs = require("fs");

// Test endpoints (place these first to avoid route conflicts)
router.get("/test", (req, res) => {
  res.json({ message: "Applications route is working" });
});

router.get("/health", (req, res) => {
  res.json({
    message: "Applications route health check",
    timestamp: new Date().toISOString(),
    models: {
      Application: !!Application,
      Job: !!Job,
      Notification: !!Notification,
    },
  });
});

// Test endpoint without authentication
router.get("/test-no-auth", (req, res) => {
  res.json({
    message: "Applications route working without auth",
    timestamp: new Date().toISOString(),
  });
});

// Simple test endpoint to check server status
router.get("/server-status", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    models: {
      Application: !!Application,
      Job: !!Job,
      Notification: !!Notification,
    },
  });
});

// Test POST endpoint without file upload
router.post("/test", auth, async (req, res) => {
  try {
    res.json({
      message: "POST endpoint working",
      body: req.body,
      user: req.user,
    });
  } catch (error) {
    console.error("Test POST error:", error);
    res.status(500).json({ message: "Test POST error", error: error.message });
  }
});

// Minimal test application submission (no file upload, no database)
router.post("/test-submit", auth, async (req, res) => {
  try {
    console.log("Test submission - Received data:", req.body);
    console.log("Test submission - User:", req.user);

    res.json({
      message: "Test application submission working",
      receivedData: req.body,
      user: req.user,
    });
  } catch (error) {
    console.error("Test submission error:", error);
    res.status(500).json({
      message: "Test submission error",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/resumes";
    // Create directory if it doesn't exist
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Created uploads directory:", uploadDir);
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error("Error creating upload directory:", error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  },
});

const MOCK_APPS_FILE = "./mock_applications.json";

// Load mock applications from file
let mockJobApplications = [];
try {
  if (fs.existsSync(MOCK_APPS_FILE)) {
    const data = fs.readFileSync(MOCK_APPS_FILE, "utf-8");
    mockJobApplications = JSON.parse(data);
    console.log("Loaded mock applications from file.");
  }
} catch (e) {
  console.error("Failed to load mock applications from file:", e);
}

function saveMockApplications() {
  try {
    fs.writeFileSync(
      MOCK_APPS_FILE,
      JSON.stringify(mockJobApplications, null, 2)
    );
    console.log("Saved mock applications to file.");
  } catch (e) {
    console.error("Failed to save mock applications:", e);
  }
}

// Create application
router.post("/", auth, (req, res, next) => {
  console.log("=== APPLICATION SUBMISSION START ===");
  console.log("Request received at:", new Date().toISOString());
  console.log("User:", req.user);
  console.log("Headers:", req.headers);

  upload.single("resume")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        message: err.message || "File upload error",
      });
    }

    // If jobId is not a valid ObjectId, treat as mock job
    const { jobId, coverLetter, portfolio, availability, expectedSalary } =
      req.body;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      // Save mock application
      const mockApp = {
        _id: `mockapp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        userId: req.user.userId,
        jobId,
        coverLetter,
        portfolio,
        availability,
        expectedSalary,
        resume: req.file ? req.file.filename : null,
        createdAt: new Date().toISOString(),
        status: "submitted",
        isMock: true,
      };
      mockJobApplications.push(mockApp);
      saveMockApplications();
      console.log("Saved mock job application:", mockApp);
      return res.json({
        message: "Application submitted for mock job",
        application: mockApp,
      });
    }

    // Continue with the application creation for real jobs
    createApplication(req, res);
  });
});

const createApplication = async (req, res) => {
  try {
    console.log("=== CREATE APPLICATION FUNCTION START ===");
    console.log("Received application data:", req.body);
    console.log("Received file:", req.file);

    const { jobId, coverLetter, portfolio, availability, expectedSalary } =
      req.body;

    console.log("Extracted data:", {
      jobId,
      coverLetter: coverLetter ? "present" : "missing",
      portfolio: portfolio || "not provided",
      availability,
      expectedSalary,
    });

    // Validate required fields
    if (
      !jobId ||
      !coverLetter?.trim() ||
      !availability?.trim() ||
      !expectedSalary
    ) {
      console.log("Missing fields:", {
        jobId: !!jobId,
        coverLetter: !!coverLetter?.trim(),
        availability: !!availability?.trim(),
        expectedSalary: !!expectedSalary,
      });
      return res.status(400).json({
        message:
          "Missing required fields: jobId, coverLetter, availability, expectedSalary",
      });
    }

    // Validate jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      console.log("Invalid jobId format:", jobId);
      return res.status(400).json({
        message: "Invalid job ID format",
      });
    }

    console.log("JobId is valid ObjectId, checking if job exists...");

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      console.log("Job not found with ID:", jobId);
      return res.status(404).json({
        message: "Job not found",
      });
    }

    console.log("Job found:", job.title, "at", job.company);

    // Check if user already applied for this job
    console.log("Checking for existing application...");
    const existingApplication = await Application.findOne({
      userId: req.user.id,
      jobId: jobId,
    });

    if (existingApplication) {
      console.log("User already applied for this job");
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    console.log("No existing application found, creating new application...");

    const application = new Application({
      userId: req.user.id,
      jobId: jobId,
      coverLetter,
      resume: req.file ? req.file.path : null,
      portfolio,
      availability,
      expectedSalary: Number(expectedSalary),
      status: "applied",
      appliedAt: new Date(),
    });

    console.log("Application object before save:", application);

    await application.save();

    console.log("Application saved successfully:", application._id);

    // Create notification for the user
    if (job) {
      try {
        await Notification.create({
          userId: req.user.id,
          type: "application",
          title: "Application Submitted",
          message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
          link: `/applications/${application._id}`,
        });
        console.log("Notification created successfully");
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Don't fail the application submission if notification fails
      }
    }

    res.status(201).json(application);
  } catch (error) {
    console.error("Error submitting application:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    console.error("Request file:", req.file);
    console.error("User ID:", req.user?.id);
    res.status(500).json({
      message: "Error submitting application",
      error: error.message,
    });
  }
};

// Get user's applications (real + mock)
router.get("/", auth, async (req, res) => {
  try {
    // Real applications from DB
    const realApps = await Application.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    // Mock applications from file
    const mockApps = mockJobApplications.filter(
      (app) => app.userId === req.user.userId
    );
    res.json([...realApps, ...mockApps]);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
});

// Get applications for a job (employer only) - Place this before /:id route
router.get("/job/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("userId", "fullName email title location")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
});

// Get specific application - Place this after specific routes
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate(
      "jobId",
      "title company location salary type description requirements skills"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      message: "Error fetching application",
      error: error.message,
    });
  }
});

// PATCH endpoint to update application status (real or mock)
router.patch("/:applicationId/status", auth, async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  // Try to update real application
  if (mongoose.Types.ObjectId.isValid(applicationId)) {
    try {
      const app = await Application.findById(applicationId);
      if (!app)
        return res.status(404).json({ message: "Application not found" });
      app.status = status;
      await app.save();
      return res.json({
        message: "Application status updated",
        application: app,
      });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Error updating application status" });
    }
  }
  // Try to update mock application
  const mockApp = mockJobApplications.find((app) => app._id === applicationId);
  if (mockApp) {
    mockApp.status = status;
    saveMockApplications();
    return res.json({
      message: "Mock application status updated",
      application: mockApp,
    });
  }
  return res.status(404).json({ message: "Application not found" });
});

// Delete application
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      message: "Error deleting application",
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Maximum size is 5MB.",
      });
    }
  }
  if (error.message === "Only PDF, DOC, and DOCX files are allowed") {
    return res.status(400).json({
      message: error.message,
    });
  }
  next(error);
});

module.exports = router;
