import express from "express";
import { requireAuth } from "../middleware/auth.js";
import jobController from "../controllers/jobController.js";

const router = express.Router();

// Get all jobs
router.get("/", jobController.getJobs);

// Get a specific job
router.get("/:id", jobController.getJob);

// Create a new job
router.post("/", requireAuth, jobController.createJob);

// Update a job
router.put("/:id", requireAuth, jobController.updateJob);

// Delete a job
router.delete("/:id", requireAuth, jobController.deleteJob);

// Apply for a job
router.post("/:id/apply", requireAuth, jobController.applyForJob);

// Get job applications
router.get("/:id/applications", requireAuth, jobController.getJobApplications);

// Update application status
router.patch(
  "/applications/:id",
  requireAuth,
  jobController.updateApplicationStatus
);

export default router;
