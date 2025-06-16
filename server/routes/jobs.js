const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roleAuth");
const axios = require("axios");

// Mock job data for testing
const mockJobs = [
  {
    _id: "1",
    title: "Senior React Developer",
    company: "Tech Corp",
    description:
      "We are looking for a senior React developer to join our team...",
    requirements: ["React", "JavaScript", "Node.js", "5+ years experience"],
    skills: ["React", "JavaScript", "Node.js", "TypeScript"],
    location: "New York, NY",
    type: "full-time",
    experience: "senior",
    salary: { min: 120000, max: 150000, currency: "USD" },
    status: "active",
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Full Stack Developer",
    company: "Startup Inc",
    description: "Join our fast-growing startup as a full stack developer...",
    requirements: ["React", "Node.js", "MongoDB", "3+ years experience"],
    skills: ["React", "Node.js", "MongoDB", "Express.js"],
    location: "San Francisco, CA",
    type: "full-time",
    experience: "mid",
    salary: { min: 100000, max: 130000, currency: "USD" },
    status: "active",
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "Frontend Developer",
    company: "Design Studio",
    description: "Create beautiful user interfaces for our clients...",
    requirements: ["React", "CSS", "JavaScript", "2+ years experience"],
    skills: ["React", "CSS", "JavaScript", "Figma"],
    location: "Remote",
    type: "contract",
    experience: "entry",
    salary: { min: 80000, max: 100000, currency: "USD" },
    status: "active",
    createdAt: new Date(),
  },
];

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const { title, location, type, experience, skills } = req.query;

    // For now, return mock data if no jobs in database
    let jobs = mockJobs;

    // Apply filters
    if (title) {
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (location) {
      jobs = jobs.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (type) {
      jobs = jobs.filter((job) => job.type === type);
    }
    if (experience) {
      jobs = jobs.filter((job) => job.experience === experience);
    }
    if (skills) {
      const skillArray = skills.split(",");
      jobs = jobs.filter((job) =>
        skillArray.some((skill) =>
          job.skills.some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    // For now, return mock data
    const job = mockJobs.find((job) => job._id === req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching job", error: error.message });
  }
});

// Create job (employer only)
router.post("/", auth, requireRole(["employer"]), async (req, res) => {
  try {
    console.log("Creating job with data:", req.body);
    console.log("User:", req.userObj);

    const job = new Job({
      ...req.body,
      postedBy: req.user.userId,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Job creation error:", error);
    res
      .status(500)
      .json({ message: "Error creating job", error: error.message });
  }
});

// Update job (employer only)
router.put("/:id", auth, requireRole(["employer"]), async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating job", error: error.message });
  }
});

// Delete job (employer only)
router.delete("/:id", auth, requireRole(["employer"]), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.userId,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting job", error: error.message });
  }
});

// Test endpoint for debugging
router.get("/test/auth", auth, (req, res) => {
  res.json({
    message: "Auth working",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint for role checking
router.get("/test/role", auth, requireRole(["employer"]), (req, res) => {
  res.json({
    message: "Role auth working",
    user: req.userObj,
    timestamp: new Date().toISOString(),
  });
});

// Real job search from JSearch API (RapidAPI)
router.get("/search/external", async (req, res) => {
  try {
    const {
      query = "software developer",
      location = "United States",
      page = 1,
      limit = 10,
    } = req.query;

    // Check if API key is configured
    if (!process.env.RAPIDAPI_KEY) {
      // Fallback to mock data if API key is not configured
      const mockExternalJobs = [
        {
          id: "ext1",
          title: "Software Engineer",
          company: "Indeed Inc.",
          location: location,
          url: "https://www.indeed.com/viewjob?jk=12345",
          description: "Work on exciting projects with a global team.",
          source: "Indeed",
          salary: "$80,000 - $120,000",
          posted_date: new Date().toISOString(),
        },
        {
          id: "ext2",
          title: "Frontend Developer",
          company: "LinkedIn Corp.",
          location: location,
          url: "https://www.linkedin.com/jobs/view/67890",
          description: "Join our frontend team to build modern UIs.",
          source: "LinkedIn",
          salary: "$90,000 - $130,000",
          posted_date: new Date().toISOString(),
        },
      ];
      return res.json(mockExternalJobs);
    }

    // JSearch API configuration
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: query,
        page: page,
        num_pages: "1",
        country: "us",
        location: location,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    // Transform the response to match our format
    const externalJobs = response.data.data.map((job, index) => ({
      id: `ext_${index}`,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      url: job.job_apply_link,
      description:
        job.job_description?.substring(0, 200) + "..." ||
        "No description available",
      source: "JSearch",
      salary: job.job_salary || "Salary not specified",
      posted_date: job.job_posted_at_datetime_utc,
      job_type: job.job_employment_type,
      requirements: job.job_required_skills || [],
    }));

    res.json(externalJobs.slice(0, limit));
  } catch (error) {
    console.error("JSearch API Error:", error);

    // Fallback to mock data on error
    const fallbackJobs = [
      {
        id: "fallback1",
        title: "Software Engineer",
        company: "Tech Company",
        location: req.query.location || "Remote",
        url: "https://example.com/job1",
        description: "Join our engineering team to build innovative solutions.",
        source: "Fallback",
        salary: "$80,000 - $120,000",
        posted_date: new Date().toISOString(),
      },
      {
        id: "fallback2",
        title: "Frontend Developer",
        company: "Startup Inc",
        location: req.query.location || "Remote",
        url: "https://example.com/job2",
        description: "Help us create amazing user experiences.",
        source: "Fallback",
        salary: "$70,000 - $100,000",
        posted_date: new Date().toISOString(),
      },
    ];

    res.json(fallbackJobs);
  }
});

module.exports = router;
