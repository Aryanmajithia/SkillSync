const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roleAuth");
const axios = require("axios");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");

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

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your-gemini-api-key"
);

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      experience,
      salaryMin,
      salaryMax,
      company,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: "active" }; // Only show active jobs

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (type) {
      filter.type = type;
    }
    if (experience) {
      filter.experience = experience;
    }
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    // Salary filter
    if (salaryMin || salaryMax) {
      filter["salary.min"] = {};
      if (salaryMin) filter["salary.min"].$gte = parseInt(salaryMin);
      if (salaryMax) filter["salary.max"] = { $lte: parseInt(salaryMax) };
    }

    const skip = (page - 1) * limit;

    console.log("Fetching jobs with filter:", filter);

    const jobs = await Job.find(filter)
      .sort({ posted_date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    console.log(`Found ${jobs.length} jobs out of ${total} total`);

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
});

// Get jobs posted by current employer
router.get("/my-jobs", auth, requireRole(["employer"]), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({
      posted_date: -1,
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    res.status(500).json({ message: "Error fetching your jobs" });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res
      .status(500)
      .json({ message: "Error fetching job", error: error.message });
  }
});

// AI-powered job description generator
router.post("/generate-job-description", auth, async (req, res) => {
  try {
    const { jobTitle, company, location, experience, skills, salary } =
      req.body;

    const prompt = `
    Generate a comprehensive job description for a ${jobTitle} position at ${company} in ${location}.
    
    Requirements:
    - Experience Level: ${experience}
    - Required Skills: ${skills?.join(", ") || "Not specified"}
    - Salary Range: ${salary?.min || "Not specified"} - ${
      salary?.max || "Not specified"
    }

    Please include:
    1. Job Summary (2-3 sentences)
    2. Key Responsibilities (5-8 bullet points)
    3. Required Qualifications (5-8 bullet points)
    4. Preferred Qualifications (3-5 bullet points)
    5. Benefits and Perks (3-5 bullet points)
    6. Company Culture description (2-3 sentences)
    7. Application instructions

    Make it engaging, professional, and inclusive. Use modern job posting language.
    Return as JSON object with separate fields for each section.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jobDescription = {};
    try {
      jobDescription = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing AI job description:", error);
      jobDescription = {
        summary: `We are seeking a talented ${jobTitle} to join our team at ${company}.`,
        responsibilities: [
          "Develop and maintain software applications",
          "Collaborate with cross-functional teams",
          "Write clean, maintainable code",
          "Participate in code reviews",
          "Troubleshoot and debug issues",
        ],
        requiredQualifications: [
          `${experience} years of experience`,
          "Strong problem-solving skills",
          "Excellent communication abilities",
          "Team player mentality",
        ],
        preferredQualifications: [
          "Experience with modern frameworks",
          "Knowledge of best practices",
          "Agile development experience",
        ],
        benefits: [
          "Competitive salary",
          "Health insurance",
          "Flexible work arrangements",
          "Professional development opportunities",
        ],
        companyCulture: `${company} fosters a collaborative and innovative environment where employees can grow and succeed.`,
        applicationInstructions:
          "Please submit your resume and cover letter through our application portal.",
      };
    }

    res.json(jobDescription);
  } catch (error) {
    console.error("Error generating job description:", error);
    res.status(500).json({ message: "Error generating job description" });
  }
});

// AI-powered job requirements optimization
router.post("/optimize-requirements", auth, async (req, res) => {
  try {
    const { jobTitle, currentRequirements, targetExperience, industry } =
      req.body;

    const prompt = `
    Optimize the job requirements for a ${jobTitle} position in the ${industry} industry.
    
    Current Requirements: ${currentRequirements?.join(", ") || "Not specified"}
    Target Experience Level: ${targetExperience}

    Please provide:
    1. Optimized requirements list (prioritized by importance)
    2. Missing critical requirements
    3. Requirements that might be too strict or unnecessary
    4. Industry-specific requirements
    5. Soft skills requirements
    6. Technical skills requirements

    Make the requirements inclusive, realistic, and aligned with current industry standards.
    Return as JSON object.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let optimization = {};
    try {
      optimization = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing AI optimization:", error);
      optimization = {
        optimizedRequirements: [
          "Strong programming fundamentals",
          "Experience with modern development practices",
          "Excellent problem-solving skills",
          "Good communication abilities",
        ],
        missingRequirements: [
          "Version control experience",
          "Testing methodologies",
        ],
        tooStrict: [
          "Specific framework requirements",
          "Exact years of experience",
        ],
        industrySpecific: [
          "Understanding of industry regulations",
          "Domain knowledge",
        ],
        softSkills: ["Team collaboration", "Time management", "Adaptability"],
        technicalSkills: [
          "Programming languages",
          "Development tools",
          "Database knowledge",
        ],
      };
    }

    res.json(optimization);
  } catch (error) {
    console.error("Error optimizing requirements:", error);
    res.status(500).json({ message: "Error optimizing requirements" });
  }
});

// AI-powered salary benchmarking
router.post("/salary-benchmark", auth, async (req, res) => {
  try {
    const { jobTitle, location, experience, skills, industry } = req.body;

    const prompt = `
    Provide salary benchmarking data for a ${jobTitle} position.
    
    Details:
    - Location: ${location}
    - Experience Level: ${experience}
    - Required Skills: ${skills?.join(", ") || "Not specified"}
    - Industry: ${industry || "Technology"}

    Please provide:
    1. Salary range (min, max, median)
    2. Salary by experience level
    3. Salary by location (if different cities)
    4. Market trends
    5. Benefits typically included
    6. Negotiation tips
    7. Equity/stock options information

    Base this on current market data and industry standards.
    Return as JSON object.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let benchmark = {};
    try {
      benchmark = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing AI benchmark:", error);
      benchmark = {
        salaryRange: {
          min: 60000,
          max: 120000,
          median: 85000,
        },
        byExperience: {
          entry: { min: 50000, max: 70000 },
          mid: { min: 70000, max: 100000 },
          senior: { min: 100000, max: 150000 },
        },
        byLocation: {
          [location]: { min: 60000, max: 120000 },
          "San Francisco": { min: 80000, max: 150000 },
          "New York": { min: 75000, max: 140000 },
        },
        marketTrends: "Growing demand, competitive market",
        benefits: [
          "Health insurance",
          "401k matching",
          "Flexible PTO",
          "Remote work options",
        ],
        negotiationTips: [
          "Research market rates",
          "Highlight unique skills",
          "Consider total compensation",
        ],
        equity: "Stock options typically 0.1% - 1% of company",
      };
    }

    res.json(benchmark);
  } catch (error) {
    console.error("Error generating salary benchmark:", error);
    res.status(500).json({ message: "Error generating benchmark" });
  }
});

// Create job with AI assistance
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      skills,
      experience,
      salary,
      type,
      useAI = false,
    } = req.body;

    let jobData = {
      title,
      company,
      location,
      description,
      requirements,
      skills,
      experience,
      salary,
      type,
      postedBy: req.user.id,
      status: "active",
      posted_date: new Date(),
    };

    // If AI assistance is requested, enhance the job posting
    if (useAI) {
      try {
        // Generate enhanced description
        const descPrompt = `
        Enhance this job description for a ${title} position:
        ${description}
        
        Make it more engaging, detailed, and professional while maintaining the original intent.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const descResult = await model.generateContent(descPrompt);
        const enhancedDescription = await descResult.response.text();

        jobData.description = enhancedDescription;

        // Generate additional requirements if not provided
        if (!requirements || requirements.length === 0) {
          const reqPrompt = `
          Generate 5-8 key requirements for a ${title} position with ${experience} experience.
          Required skills: ${skills?.join(", ") || "Not specified"}
          `;

          const reqResult = await model.generateContent(reqPrompt);
          const reqResponse = await reqResult.response.text();

          try {
            const generatedRequirements = JSON.parse(reqResponse);
            jobData.requirements = generatedRequirements;
          } catch (error) {
            // Fallback to basic requirements
            jobData.requirements = [
              `${experience} years of experience`,
              "Strong problem-solving skills",
              "Excellent communication abilities",
              "Team collaboration experience",
            ];
          }
        }

        // Generate missing skills if not provided
        if (!skills || skills.length === 0) {
          const skillsPrompt = `
          Generate 5-8 technical skills for a ${title} position.
          `;

          const skillsResult = await model.generateContent(skillsPrompt);
          const skillsResponse = await skillsResult.response.text();

          try {
            const generatedSkills = JSON.parse(skillsResponse);
            jobData.skills = generatedSkills;
          } catch (error) {
            // Fallback to basic skills
            jobData.skills = [
              "Problem solving",
              "Communication",
              "Teamwork",
              "Technical skills",
            ];
          }
        }
      } catch (aiError) {
        console.error("AI enhancement failed, using original data:", aiError);
      }
    }

    const job = new Job(jobData);
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
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

// Job Templates CRUD
router.post("/templates", auth, async (req, res) => {
  try {
    const { templateName, jobData } = req.body;
    const job = new Job({
      ...jobData,
      isTemplate: true,
      templateName,
      createdBy: req.user.id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating template" });
  }
});

router.get("/templates", auth, async (req, res) => {
  try {
    const templates = await Job.find({
      isTemplate: true,
      createdBy: req.user.id,
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates" });
  }
});

router.put("/templates/:id", auth, async (req, res) => {
  try {
    const { jobData, templateName } = req.body;
    const template = await Job.findOneAndUpdate(
      { _id: req.params.id, isTemplate: true, createdBy: req.user.id },
      { ...jobData, templateName },
      { new: true }
    );
    if (!template)
      return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: "Error updating template" });
  }
});

router.delete("/templates/:id", auth, async (req, res) => {
  try {
    const template = await Job.findOneAndDelete({
      _id: req.params.id,
      isTemplate: true,
      createdBy: req.user.id,
    });
    if (!template)
      return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting template" });
  }
});

// Bulk Import
const upload = multer({ dest: "uploads/" });

router.post("/bulk-import", auth, upload.single("file"), async (req, res) => {
  try {
    const jobs = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        jobs.push({ ...row, createdBy: req.user.id });
      })
      .on("end", async () => {
        await Job.insertMany(jobs);
        fs.unlinkSync(req.file.path);
        res.json({ message: "Bulk import successful", count: jobs.length });
      });
  } catch (error) {
    res.status(500).json({ message: "Bulk import failed" });
  }
});

// Scheduling: update job status to scheduled and set scheduledAt
router.put("/:id/schedule", auth, async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status: "scheduled", scheduledAt },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error scheduling job" });
  }
});

module.exports = router;
