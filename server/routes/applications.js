const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
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

// Create application
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    const { jobId, coverLetter, portfolio, availability, expectedSalary } =
      req.body;

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      userId: req.user.id,
      jobId: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = new Application({
      userId: req.user.id,
      jobId: jobId,
      coverLetter,
      resume: req.file ? req.file.path : null,
      portfolio,
      availability,
      expectedSalary,
      status: "applied",
      appliedAt: new Date(),
    });

    await application.save();

    // Create notification for the user
    const job = await Job.findById(jobId);
    if (job) {
      await Notification.create({
        userId: req.user.id,
        type: "application",
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
        link: `/applications/${application._id}`,
      });
    }

    res.status(201).json(application);
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      message: "Error submitting application",
      error: error.message,
    });
  }
});

// Get user's applications
router.get("/", auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId", "title company location salary type")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
});

// Get specific application
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

// Update application status (employer only)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status, interviewDate, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate("jobId", "postedBy title company")
      .populate("userId", "fullName email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is the job poster
    if (application.jobId.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    if (notes) application.notes = notes;

    await application.save();

    // Create notification for the applicant
    await Notification.create({
      userId: application.userId._id,
      type: "application",
      title: "Application Update",
      message: `Your application for ${application.jobId.title} at ${application.jobId.company} has been updated to ${status}.`,
      link: `/applications/${application._id}`,
    });

    res.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      message: "Error updating application",
      error: error.message,
    });
  }
});

// Get applications for a job (employer only)
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

module.exports = router;
