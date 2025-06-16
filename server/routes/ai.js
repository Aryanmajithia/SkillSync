const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Get job recommendations based on user profile
router.get("/job-recommendations/:userId", auth, async (req, res) => {
  try {
    // Mock implementation
    const mockRecommendations = [
      {
        id: "1",
        title: "Senior React Developer",
        company: "Tech Corp",
        location: "New York, NY",
        type: "full-time",
        experience: "senior",
        salary: { min: 120000, max: 150000 },
        skills: ["React", "JavaScript", "Node.js"],
      },
      {
        id: "2",
        title: "Full Stack Developer",
        company: "Startup Inc",
        location: "San Francisco, CA",
        type: "full-time",
        experience: "mid",
        salary: { min: 100000, max: 130000 },
        skills: ["React", "Node.js", "MongoDB"],
      },
    ];

    res.json(mockRecommendations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
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

// Get salary insights
router.get("/salary-insights", auth, async (req, res) => {
  try {
    const { jobTitle, location } = req.query;

    // Mock implementation
    const insights = {
      average: 120000,
      range: { min: 90000, max: 150000 },
      percentiles: {
        "25th": 95000,
        "50th": 120000,
        "75th": 140000,
      },
    };

    res.json(insights);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching salary insights",
      error: error.message,
    });
  }
});

// Analyze job match for resume
router.post("/job-match", auth, async (req, res) => {
  try {
    const { jobDescription, resumeSkills, resumeATS } = req.body;

    // Mock implementation - in a real app, this would use AI/ML services
    const jobKeywords = [
      "React",
      "JavaScript",
      "Node.js",
      "TypeScript",
      "AWS",
      "Docker",
      "MongoDB",
      "Express.js",
      "REST API",
      "Git",
      "Agile",
      "Testing",
    ];

    const matchingSkills = resumeSkills.filter((skill) =>
      jobKeywords.some(
        (keyword) =>
          keyword.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const missingSkills = jobKeywords.filter(
      (keyword) =>
        !resumeSkills.some(
          (skill) =>
            skill.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(skill.toLowerCase())
        )
    );

    const suggestedSkills = missingSkills.slice(0, 4);
    const resumeKeywords = resumeSkills.slice(0, 6);

    const matchScore =
      Math.floor((matchingSkills.length / jobKeywords.length) * 100) +
      Math.floor(Math.random() * 20);

    const improvements = [
      `Add ${suggestedSkills.slice(0, 2).join(" and ")} to your skills section`,
      "Include more quantifiable achievements in your experience",
      "Add a professional summary that mentions key job requirements",
      "Ensure your resume uses industry-standard terminology",
    ];

    if (matchScore < 70) {
      improvements.push(
        "Consider taking courses or certifications for missing skills"
      );
    }

    res.json({
      matchScore: Math.min(matchScore, 100),
      matchingSkills,
      missingSkills,
      suggestedSkills,
      resumeKeywords,
      jobKeywords: jobKeywords.slice(0, 8),
      improvements,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error analyzing job match",
      error: error.message,
    });
  }
});

// AI Chatbot endpoint (Gemini)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        response:
          "AI service is not configured. Please contact the administrator.",
        error: "GEMINI_API_KEY not found in environment variables",
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a context-aware prompt for career/job-related questions
    const prompt = `You are a helpful AI career assistant. A user is asking: "${message}"

Please provide helpful, professional advice related to careers, job searching, resume writing, interview preparation, professional development, or any work-related topics. Keep responses concise but informative (2-4 sentences). If the question is not career-related, politely redirect to career topics.

Response:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({
      response:
        "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
      error: error.message,
    });
  }
});

module.exports = router;
