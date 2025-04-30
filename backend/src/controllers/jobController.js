import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const { search, category, location, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("employer", "name email");

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({ message: "Error getting jobs" });
  }
};

// Get a specific job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error getting job:", error);
    res.status(500).json({ message: "Error getting job" });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      employer: req.user._id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Error creating job" });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user._id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Error updating job" });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employer: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job" });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: req.params.id,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = new Application({
      job: req.params.id,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Error applying for job" });
  }
};

// Get job applications
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error getting job applications:", error);
    res.status(500).json({ message: "Error getting job applications" });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Error updating application status" });
  }
};

export default {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
};
