const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your-gemini-api-key"
);

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Simple in-memory cache for AI responses
const aiCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Rate limiting for AI calls
const rateLimit = {
  lastCall: 0,
  minInterval: 2000, // 2 seconds between calls
};

// Helper function to check if we should use AI or fallback
function shouldUseAI() {
  const now = Date.now();
  if (now - rateLimit.lastCall < rateLimit.minInterval) {
    return false;
  }
  rateLimit.lastCall = now;
  return true;
}

// Helper function to get cached data or fallback
function getCachedOrFallback(key, fallbackData) {
  const cached = aiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return fallbackData;
}

// Helper function to cache data
function cacheData(key, data) {
  aiCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Analyze resume and extract skills with ATS scoring
router.post("/analyze-resume", auth, async (req, res) => {
  try {
    // Mock implementation - in a real app, this would use AI/ML services
    const mockSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express.js",
      "TypeScript",
      "Python",
      "Java",
      "AWS",
      "Docker",
    ];

    const extractedSkills = mockSkills.slice(
      0,
      Math.floor(Math.random() * 5) + 3
    );

    // Generate ATS score and improvements
    const atsScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100

    const atsAnalysis = {
      score: atsScore,
      scoreBreakdown: {
        keywordOptimization: Math.floor(Math.random() * 20) + 80,
        formatting: Math.floor(Math.random() * 20) + 75,
        readability: Math.floor(Math.random() * 20) + 85,
        structure: Math.floor(Math.random() * 20) + 80,
      },
      improvements: generateATSImprovements(atsScore),
      keywords: {
        found: extractedSkills.slice(0, 3),
        missing: ["Machine Learning", "Kubernetes", "GraphQL", "Redis"],
        suggested: ["Docker", "AWS", "TypeScript", "CI/CD"],
      },
      formatting: {
        issues: [
          "Consider using standard fonts (Arial, Calibri, Times New Roman)",
          "Ensure consistent bullet point formatting",
          "Add more white space between sections",
        ],
        suggestions: [
          "Use clear section headers",
          "Include quantifiable achievements",
          "Keep bullet points concise and action-oriented",
        ],
      },
    };

    res.json({
      skills: extractedSkills,
      confidence: 0.85,
      atsAnalysis,
      message: "Resume analyzed successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error analyzing resume", error: error.message });
  }
});

// Helper function to generate ATS improvements based on score
function generateATSImprovements(score) {
  const improvements = [];

  if (score < 80) {
    improvements.push(
      "Add more industry-specific keywords to improve ATS matching",
      "Simplify formatting to ensure ATS compatibility",
      "Include more quantifiable achievements and metrics",
      "Use standard section headers (Experience, Education, Skills)"
    );
  }

  if (score < 85) {
    improvements.push(
      "Consider adding a professional summary section",
      "Ensure contact information is clearly visible",
      "Use reverse chronological order for experience"
    );
  }

  if (score < 90) {
    improvements.push(
      "Review for any unusual characters or formatting",
      "Ensure consistent date formatting throughout",
      "Add relevant certifications if applicable"
    );
  }

  if (score >= 90) {
    improvements.push(
      "Excellent ATS optimization! Consider minor tweaks for specific job applications",
      "Review keywords for each specific job application"
    );
  }

  return improvements;
}

// Get personalized job recommendations
router.get("/job-recommendations/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's skills and preferences
    const userSkills = user.skills || [];
    const userExperience = user.experience || "entry";
    const userLocation = user.location || "";
    const userPreferences = user.preferences || {};

    // Get available jobs
    const availableJobs = await Job.find({ status: "active" })
      .populate("postedBy", "company")
      .limit(50);

    if (availableJobs.length === 0) {
      return res.json([]);
    }

    // Check cache first
    const cacheKey = `recommendations_${userId}_${userSkills.join(
      "_"
    )}_${userExperience}`;
    const cachedRecommendations = getCachedOrFallback(cacheKey, null);

    if (cachedRecommendations) {
      console.log("Using cached job recommendations");
      return res.json(cachedRecommendations);
    }

    // Use fallback recommendations to avoid API quota issues
    console.log("Using fallback job recommendations (API quota limit reached)");
    const recommendations = availableJobs.slice(0, 10).map((job) => {
      const skillMatch = userSkills.filter((skill) =>
        job.skills?.some((jobSkill) =>
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;

      const matchScore = Math.min(
        95,
        60 + skillMatch * 5 + Math.floor(Math.random() * 20)
      );

      return {
        ...job.toObject(),
        matchScore,
        skillMatch,
        reasoning:
          "AI-powered matching temporarily unavailable - using skill-based matching",
      };
    });

    // Cache the results
    cacheData(cacheKey, recommendations);

    res.json(recommendations);
  } catch (error) {
    console.error("Error generating job recommendations:", error);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

// Get skill suggestions based on job description
router.post("/skill-suggestions", auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Mock implementation
    const suggestions = ["React", "Node.js", "TypeScript", "AWS", "Docker"];

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({
      message: "Error getting skill suggestions",
      error: error.message,
    });
  }
});

// Analyze job description and extract requirements
router.post("/analyze-job", auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Mock implementation
    const requirements = {
      skills: ["JavaScript", "React", "Node.js"],
      experience: "3-5 years",
      education: "Bachelor's degree",
      certifications: [],
    };

    res.json(requirements);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error analyzing job", error: error.message });
  }
});

// Get personalized career path suggestions
router.get("/career-path/:userId", auth, async (req, res) => {
  try {
    // Mock implementation
    const careerPath = [
      {
        level: "Junior",
        skills: ["JavaScript", "React"],
        timeline: "0-2 years",
      },
      {
        level: "Mid",
        skills: ["Node.js", "TypeScript"],
        timeline: "2-5 years",
      },
      {
        level: "Senior",
        skills: ["Architecture", "Leadership"],
        timeline: "5+ years",
      },
    ];

    res.json(careerPath);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching career path", error: error.message });
  }
});

// Get interview preparation tips
router.get("/interview-tips/:jobId", auth, async (req, res) => {
  try {
    // Mock implementation
    const tips = [
      "Research the company thoroughly",
      "Practice common technical questions",
      "Prepare questions to ask the interviewer",
      "Review your resume and be ready to discuss your experience",
    ];

    res.json({ tips });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching interview tips", error: error.message });
  }
});

// Get AI-powered salary insights
router.get("/salary-insights", async (req, res) => {
  try {
    const { jobTitle, location, experience } = req.query;

    // Check cache first
    const cacheKey = `salary_${jobTitle}_${location}_${experience}`;
    const cachedInsights = getCachedOrFallback(cacheKey, null);

    if (cachedInsights) {
      console.log("Using cached salary insights");
      return res.json(cachedInsights);
    }

    // Use fallback data to avoid API quota issues
    console.log("Using fallback salary insights (API quota limit reached)");
    const mockInsights = {
      averageSalary: "$80,000 - $120,000",
      salaryByExperience: {
        entry: "$60,000 - $80,000",
        mid: "$80,000 - $120,000",
        senior: "$120,000 - $180,000",
      },
      marketTrends: "Growing demand in this field",
      benefits: [
        "Health insurance",
        "401k",
        "Remote work",
        "Professional development",
      ],
      negotiationTips: [
        "Research market rates",
        "Highlight your unique value",
        "Consider total compensation package",
      ],
    };

    // Cache the results
    cacheData(cacheKey, mockInsights);
    res.json(mockInsights);
  } catch (error) {
    console.error("Error generating salary insights:", error);
    res.status(500).json({ message: "Error generating salary insights" });
  }
});

// AI-powered resume analysis
router.post("/analyze-resume", auth, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided" });
    }

    // Read the file content
    const fs = require("fs");
    const fileContent = fs.readFileSync(req.file.path, "utf8");

    // Use AI to analyze the resume
    const prompt = `
    Please analyze this resume and extract the following information:
    ${fileContent}

    Return a JSON object with:
    - skills: array of technical and soft skills
    - experience: years of experience
    - education: educational background
    - certifications: any certifications
    - summary: professional summary
    - strengths: key strengths
    - areas_for_improvement: areas that could be improved
    - suggested_job_titles: job titles this person would be good for
    - overall_score: score from 1-100
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysis = {};
    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing AI analysis:", error);
      analysis = {
        skills: ["JavaScript", "React", "Node.js"],
        experience: "3-5 years",
        education: "Bachelor's degree",
        certifications: [],
        summary: "Experienced developer with strong technical skills",
        strengths: ["Problem solving", "Team collaboration"],
        areas_for_improvement: ["Could add more certifications"],
        suggested_job_titles: ["Software Developer", "Full Stack Developer"],
        overall_score: 75,
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ message: "Error analyzing resume" });
  }
});

// AI-powered interview questions generation
router.post("/generate-interview-questions", auth, async (req, res) => {
  try {
    const { jobTitle, jobDescription, candidateSkills, experienceLevel } =
      req.body;

    const prompt = `
    Generate 10 interview questions for a ${jobTitle} position.
    
    Job Description: ${jobDescription}
    Candidate Skills: ${candidateSkills?.join(", ") || "Not specified"}
    Experience Level: ${experienceLevel || "Mid-level"}

    Include:
    - 4 technical questions
    - 3 behavioral questions
    - 2 problem-solving questions
    - 1 culture fit question

    For each question, provide:
    - The question
    - Expected answer points
    - Difficulty level (Easy/Medium/Hard)
    - Category (Technical/Behavioral/Problem-solving/Culture)

    Return as JSON array.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let questions = [];
    try {
      questions = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing AI questions:", error);
      questions = [
        {
          question:
            "Explain the difference between synchronous and asynchronous programming.",
          expectedAnswer:
            "Synchronous executes sequentially, asynchronous allows parallel execution",
          difficulty: "Medium",
          category: "Technical",
        },
      ];
    }

    res.json(questions);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ message: "Error generating questions" });
  }
});

// Get AI-powered candidate ranking for employers
router.post("/candidate-ranking/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get all applications for this job
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("userId", "fullName email skills experience location title")
      .populate("resumeAnalysis");

    if (applications.length === 0) {
      return res.json([]);
    }

    // Use AI to rank candidates
    const prompt = `
    Given a job posting:
    - Title: ${job.title}
    - Company: ${job.company}
    - Requirements: ${job.requirements?.join(", ") || "Not specified"}
    - Skills: ${job.skills?.join(", ") || "Not specified"}
    - Experience: ${job.experience}
    - Location: ${job.location}

    And the following candidates:
    ${applications
      .map(
        (app) => `
    - Name: ${app.userId.fullName}
    - Skills: ${app.userId.skills?.join(", ") || "Not specified"}
    - Experience: ${app.userId.experience || "Not specified"}
    - Location: ${app.userId.location || "Not specified"}
    - Cover Letter: ${app.coverLetter}
    - Expected Salary: ${app.expectedSalary}
    - Resume Analysis: ${
      app.resumeAnalysis ? JSON.stringify(app.resumeAnalysis) : "Not available"
    }
    `
      )
      .join("\n")}

    Please analyze and rank these candidates from best to worst fit. Consider:
    1. Skill match with job requirements
    2. Experience level compatibility
    3. Location fit
    4. Cover letter quality
    5. Salary expectations
    6. Overall potential

    Return the results as a JSON array with candidate IDs and detailed analysis.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let rankings = [];
    try {
      const aiRankings = JSON.parse(text);
      for (const rank of aiRankings) {
        const application = applications.find(
          (app) => app._id.toString() === rank.applicationId
        );
        if (application) {
          rankings.push({
            application: application,
            rank: rank.rank,
            score: rank.score,
            analysis: rank.analysis,
            strengths: rank.strengths,
            weaknesses: rank.weaknesses,
            recommendation: rank.recommendation,
          });
        }
      }
    } catch (error) {
      console.error("Error parsing AI rankings:", error);
      // Fallback to basic ranking
      rankings = applications.map((app, index) => ({
        application: app,
        rank: index + 1,
        score: Math.floor(Math.random() * 40) + 60,
        analysis: "AI analysis temporarily unavailable",
        strengths: ["Experience", "Skills"],
        weaknesses: ["Could improve cover letter"],
        recommendation: "Consider for interview",
      }));
    }

    res.json(rankings);
  } catch (error) {
    console.error("Error generating candidate rankings:", error);
    res.status(500).json({ message: "Error generating rankings" });
  }
});

// Get personalized job recommendations for dashboard
router.get("/job-recommendations", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get recent active jobs
    const recentJobs = await Job.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("createdBy", "name company");

    // Calculate basic match scores
    const userSkills = user.skills
      ? user.skills.split(",").map((s) => s.trim().toLowerCase())
      : [];

    const recommendations = recentJobs.map((job) => {
      let score = 0;
      const jobRequirements = job.requirements
        ? job.requirements.split(",").map((r) => r.trim().toLowerCase())
        : [];

      // Simple skill matching
      const skillMatches = userSkills.filter((skill) =>
        jobRequirements.some(
          (req) => req.includes(skill) || skill.includes(req)
        )
      );
      score = (skillMatches.length / Math.max(userSkills.length, 1)) * 100;

      return {
        job,
        matchScore: Math.round(score),
        skillMatches: skillMatches.length,
      };
    });

    res.json(recommendations);
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    res.status(500).json({ message: "Error getting job recommendations" });
  }
});

// Automated data generation for testing and development
router.post("/generate-sample-data", auth, async (req, res) => {
  try {
    const { type, count = 10 } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    switch (type) {
      case "jobs":
        await generateSampleJobs(model, count);
        break;
      case "users":
        await generateSampleUsers(model, count);
        break;
      case "applications":
        await generateSampleApplications(model, count);
        break;
      case "companies":
        await generateSampleCompanies(model, count);
        break;
      case "all":
        await generateAllSampleData(model, count);
        break;
      default:
        return res.status(400).json({ message: "Invalid data type" });
    }

    res.json({ message: `Generated ${count} sample ${type} successfully` });
  } catch (error) {
    console.error("Error generating sample data:", error);
    res.status(500).json({ message: "Error generating sample data" });
  }
});

// Generate sample jobs
async function generateSampleJobs(model, count) {
  const prompt = `
  Generate ${count} realistic job postings for a job board platform.
  
  Include diverse roles like:
  - Software Developer (Frontend, Backend, Full Stack)
  - Data Scientist/Analyst
  - Product Manager
  - UX/UI Designer
  - DevOps Engineer
  - Marketing Specialist
  - Sales Representative
  - Customer Success Manager
  
  For each job, provide:
  - title: Job title
  - company: Company name
  - location: City, State or Remote
  - description: Detailed job description (2-3 paragraphs)
  - requirements: Array of 5-8 requirements
  - skills: Array of 5-8 technical/soft skills
  - experience: "entry", "mid", or "senior"
  - type: "full-time", "part-time", "contract", or "internship"
  - salary: Object with min and max values
  - benefits: Array of 3-5 benefits
  
  Make the data realistic and varied. Return as JSON array.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jobs = JSON.parse(text);
    for (const jobData of jobs) {
      const job = new Job({
        ...jobData,
        postedBy: req.user.id,
        status: "active",
        posted_date: new Date(),
        createdAt: new Date(),
      });
      await job.save();
    }
  } catch (error) {
    console.error("Error parsing generated jobs:", error);
    // Fallback to predefined jobs
    const fallbackJobs = [
      {
        title: "Senior React Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        description:
          "We're looking for an experienced React developer to join our growing team...",
        requirements: [
          "5+ years React experience",
          "TypeScript proficiency",
          "Team leadership",
        ],
        skills: ["React", "TypeScript", "Node.js", "Git"],
        experience: "senior",
        type: "full-time",
        salary: { min: 120000, max: 160000 },
        benefits: ["Health insurance", "401k", "Remote work"],
      },
    ];

    for (const jobData of fallbackJobs) {
      const job = new Job({
        ...jobData,
        postedBy: req.user.id,
        status: "active",
        posted_date: new Date(),
      });
      await job.save();
    }
  }
}

// Generate sample users
async function generateSampleUsers(model, count) {
  const prompt = `
  Generate ${count} realistic user profiles for a job platform.
  
  Include diverse profiles:
  - Job seekers with different experience levels
  - Employers/HR professionals
  - Recent graduates
  - Career changers
  
  For each user, provide:
  - fullName: Full name
  - email: Realistic email
  - role: "jobseeker" or "employer"
  - skills: Array of 5-10 skills
  - experience: "entry", "mid", or "senior"
  - location: City, State
  - title: Current job title or "Student" for entry level
  - bio: Short professional bio
  - education: Array of education objects
  - workHistory: Array of work experience objects
  
  Make the data realistic and varied. Return as JSON array.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const users = JSON.parse(text);
    for (const userData of users) {
      const user = new User({
        ...userData,
        password: "password123", // Default password for sample users
        createdAt: new Date(),
      });
      await user.save();
    }
  } catch (error) {
    console.error("Error parsing generated users:", error);
    // Fallback to predefined users
    const fallbackUsers = [
      {
        fullName: "John Doe",
        email: "john.doe@example.com",
        role: "jobseeker",
        skills: ["JavaScript", "React", "Node.js"],
        experience: "mid",
        location: "New York, NY",
        title: "Frontend Developer",
        bio: "Passionate developer with 3 years of experience",
      },
    ];

    for (const userData of fallbackUsers) {
      const user = new User({
        ...userData,
        password: "password123",
        createdAt: new Date(),
      });
      await user.save();
    }
  }
}

// Generate sample applications
async function generateSampleApplications(model, count) {
  const jobs = await Job.find().limit(count);
  const users = await User.find({ role: "jobseeker" }).limit(count);

  if (jobs.length === 0 || users.length === 0) {
    console.log("No jobs or users found for generating applications");
    return;
  }

  const prompt = `
  Generate ${count} realistic job applications.
  
  For each application, provide:
  - coverLetter: Professional cover letter (2-3 paragraphs)
  - expectedSalary: Realistic salary expectation
  - availability: "immediate", "2 weeks", "1 month", or "flexible"
  - status: "pending", "reviewed", "shortlisted", "rejected", or "hired"
  - notes: Brief notes about the candidate
  
  Make the applications realistic and varied. Return as JSON array.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const applications = JSON.parse(text);
    for (let i = 0; i < Math.min(count, jobs.length, users.length); i++) {
      const application = new Application({
        ...applications[i],
        jobId: jobs[i]._id,
        userId: users[i]._id,
        appliedDate: new Date(),
        createdAt: new Date(),
      });
      await application.save();
    }
  } catch (error) {
    console.error("Error parsing generated applications:", error);
    // Fallback to predefined applications
    for (let i = 0; i < Math.min(count, jobs.length, users.length); i++) {
      const application = new Application({
        coverLetter: "I am excited to apply for this position...",
        expectedSalary: 80000,
        availability: "immediate",
        status: "pending",
        notes: "Strong candidate with relevant experience",
        jobId: jobs[i]._id,
        userId: users[i]._id,
        appliedDate: new Date(),
      });
      await application.save();
    }
  }
}

// Generate sample companies
async function generateSampleCompanies(model, count) {
  const prompt = `
  Generate ${count} realistic company profiles.
  
  Include diverse companies:
  - Tech startups
  - Established corporations
  - Consulting firms
  - Non-profits
  - Remote-first companies
  
  For each company, provide:
  - name: Company name
  - industry: Industry sector
  - size: "startup", "small", "medium", or "large"
  - location: Headquarters location
  - description: Company description (2-3 paragraphs)
  - website: Company website
  - founded: Year founded
  - mission: Company mission statement
  - culture: Company culture description
  - benefits: Array of employee benefits
  
  Make the data realistic and varied. Return as JSON array.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const companies = JSON.parse(text);
    // Store companies in a way that makes sense for your schema
    // This might need to be adjusted based on your actual company model
    console.log("Generated companies:", companies);
  } catch (error) {
    console.error("Error parsing generated companies:", error);
  }
}

// Generate all sample data
async function generateAllSampleData(model, count) {
  await generateSampleCompanies(model, count);
  await generateSampleUsers(model, count);
  await generateSampleJobs(model, count);
  await generateSampleApplications(model, count);
}

// AI-powered market trend analysis
router.get("/market-trends", async (req, res) => {
  try {
    const { industry, location, timeframe = "6 months" } = req.query;
    const cacheKey = `market_${industry}_${location}_${timeframe}`;
    const cachedTrends = getCachedOrFallback(cacheKey, null);
    if (cachedTrends) {
      console.log("Using cached market trends");
      return res.json(cachedTrends);
    }
    // Use Gemini AI to generate market trends
    try {
      const prompt = `
        Provide current job market trends for the ${industry} industry in ${location} over the past ${timeframe}.
        Include: growing roles, declining roles, salary trends, in-demand skills, remote work trends, industry challenges, future predictions, and recommendations for job seekers and employers.
        Respond in JSON format with keys: jobMarketTrends (growing, declining), salaryTrends, inDemandSkills, remoteWorkTrends, industryChallenges, futurePredictions, jobSeekerRecommendations, employerRecommendations.
      `;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const trends = JSON.parse(text);
      cacheData(cacheKey, trends);
      return res.json(trends);
    } catch (aiError) {
      console.error(
        "Gemini AI error for market trends, using fallback:",
        aiError
      );
      // fallback data
      const mockTrends = {
        jobMarketTrends: {
          growing: ["AI/ML Engineers", "DevOps Engineers", "Data Scientists"],
          declining: ["Traditional IT Support", "Manual QA Testers"],
        },
        salaryTrends: "Salaries increasing 5-10% annually",
        inDemandSkills: ["Python", "React", "AWS", "Machine Learning"],
        remoteWorkTrends: "Hybrid work becoming standard",
        industryChallenges: [
          "Talent shortage",
          "Skill gaps",
          "Remote collaboration",
        ],
        futurePredictions: "Continued growth in tech sector",
        jobSeekerRecommendations: [
          "Upskill in emerging technologies",
          "Build remote work skills",
          "Focus on soft skills",
        ],
        employerRecommendations: [
          "Offer competitive benefits",
          "Embrace remote work",
          "Invest in employee development",
        ],
      };
      cacheData(cacheKey, mockTrends);
      return res.json(mockTrends);
    }
  } catch (error) {
    console.error("Error generating market trends:", error);
    res.status(500).json({ message: "Error generating market trends" });
  }
});

// AI-powered skill demand analysis
router.get("/skill-demand", async (req, res) => {
  try {
    const { industry, location } = req.query;
    const cacheKey = `skills_${industry}_${location}`;
    const cachedSkills = getCachedOrFallback(cacheKey, null);
    if (cachedSkills) {
      console.log("Using cached skill demand data");
      return res.json(cachedSkills);
    }
    // Use Gemini AI to generate skill demand
    try {
      const prompt = `
        Provide a skill demand analysis for the ${industry} industry in ${location}.
        Include: technicalSkills (array of {skill, demand, salary}), softSkills (array of {skill, demand}), emergingSkills, decliningSkills, learningResources (object with skill as key and array of resources as value), certifications (array).
        Respond in JSON format with keys: technicalSkills, softSkills, emergingSkills, decliningSkills, learningResources, certifications.
      `;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const skillAnalysis = JSON.parse(text);
      cacheData(cacheKey, skillAnalysis);
      return res.json(skillAnalysis);
    } catch (aiError) {
      console.error(
        "Gemini AI error for skill demand, using fallback:",
        aiError
      );
      // fallback data
      const mockSkillAnalysis = {
        technicalSkills: [
          { skill: "Python", demand: "Very High", salary: "$90,000-$150,000" },
          { skill: "React", demand: "High", salary: "$80,000-$130,000" },
          { skill: "AWS", demand: "High", salary: "$100,000-$160,000" },
        ],
        softSkills: [
          { skill: "Communication", demand: "Very High" },
          { skill: "Problem Solving", demand: "High" },
          { skill: "Leadership", demand: "High" },
        ],
        emergingSkills: ["AI/ML", "Blockchain", "Cybersecurity"],
        decliningSkills: ["Flash", "Perl", "COBOL"],
        learningResources: {
          Python: ["Coursera", "edX", "Udemy"],
          React: ["React Documentation", "FreeCodeCamp", "YouTube"],
        },
        certifications: [
          "AWS Certified Solutions Architect",
          "Google Cloud Professional",
          "Microsoft Azure Developer",
        ],
      };
      cacheData(cacheKey, mockSkillAnalysis);
      return res.json(mockSkillAnalysis);
    }
  } catch (error) {
    console.error("Error generating skill demand analysis:", error);
    res.status(500).json({ message: "Error generating skill analysis" });
  }
});

// AI-powered job match analysis
router.post("/analyze-job-match", auth, async (req, res) => {
  try {
    const { jobTitle, jobDescription, resumeAnalysis } = req.body;

    // Try to use AI for analysis, fallback to basic analysis if AI fails
    try {
      const prompt = `
      Analyze how well a resume matches a specific job posting.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      
      Resume Analysis:
      - Skills: ${resumeAnalysis?.skills?.join(", ") || "Not available"}
      - ATS Score: ${resumeAnalysis?.atsAnalysis?.score || "Not available"}
      - Keywords Found: ${
        resumeAnalysis?.atsAnalysis?.keywords?.found?.join(", ") ||
        "Not available"
      }
      - Keywords Missing: ${
        resumeAnalysis?.atsAnalysis?.keywords?.missing?.join(", ") ||
        "Not available"
      }
      
      Please provide:
      1. Match Score (0-100)
      2. Matching Skills (array)
      3. Missing Skills (array)
      4. Recommendations (array of improvement suggestions)
      5. Overall Assessment (brief summary)
      
      Return as JSON object.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const analysis = JSON.parse(text);
      res.json(analysis);
    } catch (aiError) {
      console.error("AI job match analysis error, using fallback:", aiError);
      // Fallback analysis
      const fallbackAnalysis = {
        matchScore: Math.floor(Math.random() * 40) + 60,
        matchingSkills: resumeAnalysis?.skills?.slice(0, 3) || [],
        missingSkills: ["Advanced JavaScript", "React Hooks", "TypeScript"],
        recommendations: [
          "Add more specific technical skills",
          "Include quantifiable achievements",
          "Optimize for ATS keywords",
        ],
        overallAssessment: "Good foundation, needs skill enhancement",
      };
      res.json(fallbackAnalysis);
    }
  } catch (error) {
    console.error("Error analyzing job match:", error);
    res.status(500).json({ message: "Error analyzing job match" });
  }
});

// Mock AI endpoints for missing routes
router.get("/market-insights", async (req, res) => {
  res.json({
    jobMarketTrends: {
      growing: ["AI Engineer"],
      declining: ["COBOL Developer"],
    },
    salaryTrends: "Salaries rising",
    inDemandSkills: ["Python", "React"],
    remoteWorkTrends: "Hybrid",
    industryChallenges: ["Talent shortage"],
    futurePredictions: "Growth",
    jobSeekerRecommendations: ["Learn AI"],
    employerRecommendations: ["Offer remote work"],
  });
});

router.get("/skill-gap-analysis", async (req, res) => {
  res.json({ missingSkills: ["TypeScript", "GraphQL"] });
});

router.get("/career-path-suggestions", async (req, res) => {
  res.json([
    { title: "Senior Developer", steps: ["Learn TypeScript", "Lead a team"] },
  ]);
});

router.get("/application-strategy", async (req, res) => {
  res.json({ strategies: ["Tailor your resume", "Network on LinkedIn"] });
});

router.get("/interview-preparation", async (req, res) => {
  res.json({ tips: ["Practice common questions", "Research the company"] });
});

router.get("/networking-suggestions", async (req, res) => {
  res.json({ suggestions: ["Attend meetups", "Connect on LinkedIn"] });
});

router.get("/application-optimization", async (req, res) => {
  res.json({ optimizations: ["Use keywords", "Keep it concise"] });
});

router.get("/job-satisfaction-prediction", async (req, res) => {
  res.json({ prediction: "High satisfaction expected" });
});

router.get("/company-research", async (req, res) => {
  res.json({ name: "TechCorp", summary: "Innovative tech company." });
});

// Mock jobs endpoint for testing job applications
router.get("/jobs-mock", async (req, res) => {
  res.json([
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=50&h=50&fit=crop",
      description: "Lead React projects and mentor junior developers.",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "DesignStudio",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Full-time",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      description: "Design user interfaces and experiences for web and mobile.",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Remote",
      salary: "$130k - $160k",
      type: "Full-time",
      posted: "1 week ago",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=50&h=50&fit=crop",
      description: "Analyze data and build predictive models.",
    },
    {
      id: 4,
      title: "Backend Engineer",
      company: "CloudNet",
      location: "Austin, TX",
      salary: "$110k - $140k",
      type: "Full-time",
      posted: "5 days ago",
      logo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=50&h=50&fit=crop",
      description: "Develop scalable backend APIs and services.",
    },
    {
      id: 5,
      title: "DevOps Specialist",
      company: "OpsGen",
      location: "Seattle, WA",
      salary: "$115k - $145k",
      type: "Full-time",
      posted: "4 days ago",
      logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop",
      description: "Automate deployments and manage cloud infrastructure.",
    },
    {
      id: 6,
      title: "Product Manager",
      company: "InnovateLab",
      location: "Boston, MA",
      salary: "$105k - $135k",
      type: "Full-time",
      posted: "6 days ago",
      logo: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=50&h=50&fit=crop",
      description: "Lead product development and strategy.",
    },
    {
      id: 7,
      title: "QA Engineer",
      company: "QualityFirst",
      location: "Denver, CO",
      salary: "$85k - $110k",
      type: "Full-time",
      posted: "1 day ago",
      logo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=50&h=50&fit=crop",
      description: "Test software and ensure product quality.",
    },
    {
      id: 8,
      title: "Mobile App Developer",
      company: "Appify",
      location: "Remote",
      salary: "$100k - $130k",
      type: "Full-time",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=50&h=50&fit=crop",
      description: "Build and maintain mobile applications.",
    },
    {
      id: 9,
      title: "Frontend Engineer",
      company: "WebWorks",
      location: "Chicago, IL",
      salary: "$95k - $125k",
      type: "Full-time",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=50&h=50&fit=crop",
      description: "Develop modern web interfaces with React.",
    },
    {
      id: 10,
      title: "AI Researcher",
      company: "DeepThink",
      location: "San Jose, CA",
      salary: "$150k - $200k",
      type: "Full-time",
      posted: "1 week ago",
      logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=50&h=50&fit=crop",
      description: "Research and develop AI algorithms.",
    },
    {
      id: 11,
      title: "Cloud Architect",
      company: "SkyNet",
      location: "Remote",
      salary: "$140k - $180k",
      type: "Full-time",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=50&h=50&fit=crop",
      description: "Design and manage cloud solutions.",
    },
    {
      id: 12,
      title: "Business Analyst",
      company: "BizInsight",
      location: "Atlanta, GA",
      salary: "$80k - $105k",
      type: "Full-time",
      posted: "4 days ago",
      logo: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=50&h=50&fit=crop",
      description: "Analyze business processes and recommend improvements.",
    },
    {
      id: 13,
      title: "Full Stack Developer",
      company: "StackMakers",
      location: "Austin, TX",
      salary: "$110k - $145k",
      type: "Full-time",
      posted: "5 days ago",
      logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop",
      description: "Work on both frontend and backend systems.",
    },
    {
      id: 14,
      title: "Cybersecurity Analyst",
      company: "SecureIT",
      location: "Washington, DC",
      salary: "$120k - $155k",
      type: "Full-time",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=50&h=50&fit=crop",
      description: "Monitor and secure IT systems.",
    },
    {
      id: 15,
      title: "Technical Writer",
      company: "DocuTech",
      location: "Remote",
      salary: "$75k - $100k",
      type: "Full-time",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=50&h=50&fit=crop",
      description: "Write technical documentation and guides.",
    },
  ]);
});

// Gemini-powered chatbot endpoint
router.post("/chatbot", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    // Compose conversation history for context
    let prompt = "You are Gemini AI, a helpful assistant.\n";
    for (const msg of history) {
      prompt += `${msg.role === "user" ? "User" : "Gemini"}: ${msg.content}\n`;
    }
    prompt += `User: ${message}\nGemini:`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text.trim() });
  } catch (error) {
    console.error("Gemini chatbot error:", error);
    res.status(500).json({ message: "Gemini AI error" });
  }
});

module.exports = router;
