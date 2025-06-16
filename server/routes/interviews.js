const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const UserSettings = require("../models/UserSettings");
const auth = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get all interviews for a user
router.get("/", auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Error fetching interviews" });
  }
});

// Get a specific interview
router.get("/:id", auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({ message: "Error fetching interview" });
  }
});

// Start a new interview
router.post("/start", auth, async (req, res) => {
  try {
    const { type, role, level } = req.body;

    // Check if user has premium access for premium interviews
    if (type === "premium") {
      const userSettings = await UserSettings.findOne({ userId: req.user.id });
      if (!userSettings?.features?.premiumAccess) {
        return res.status(403).json({
          message: "Premium access required for premium interviews",
          requiresUpgrade: true,
        });
      }
    }

    const interview = new Interview({
      userId: req.user.id,
      type,
      role,
      level,
      status: "in-progress",
      startedAt: new Date(),
    });

    await interview.save();

    // Update usage stats
    await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      {
        $inc: { "features.usageStats.interviewsCompleted": 1 },
        $set: { "features.usageStats.lastActive": new Date() },
      },
      { upsert: true }
    );

    res.status(201).json(interview);
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ message: "Error starting interview" });
  }
});

// Add question and answer to interview
router.post("/:id/question", auth, async (req, res) => {
  try {
    const { question, category, timeLimit, userAnswer, audioUrl } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Generate AI feedback for the answer
    let score = 0;
    let feedback = "";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert interviewer evaluating a ${interview.level} ${interview.role} interview response.

Question: ${question}
User Answer: ${userAnswer}

Provide:
1. A score out of 100
2. Specific feedback on strengths and areas for improvement
3. Suggestions for better answers

Format as JSON:
{
  "score": number,
  "feedback": "detailed feedback",
  "suggestions": ["suggestion1", "suggestion2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = JSON.parse(response.text());

      score = analysis.score;
      feedback = analysis.feedback;
    } catch (aiError) {
      console.error("AI feedback generation failed:", aiError);
      // Fallback scoring
      score = Math.floor(Math.random() * 30) + 70;
      feedback = "Good response! Consider providing more specific examples.";
    }

    // Add question to interview
    interview.questions.push({
      question,
      category,
      timeLimit,
      userAnswer,
      score,
      feedback,
      audioUrl,
      timestamp: new Date(),
    });

    // Add to conversation history
    interview.conversationHistory.push(
      {
        role: "interviewer",
        content: question,
        timestamp: new Date(),
      },
      {
        role: "user",
        content: userAnswer,
        timestamp: new Date(),
      }
    );

    await interview.save();

    res.json({
      question: interview.questions[interview.questions.length - 1],
      score,
      feedback,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Error adding question" });
  }
});

// Generate next AI question
router.post("/:id/generate-question", auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Generate AI question
    let question = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert interviewer conducting a ${
        interview.level
      } ${interview.role} interview.

Previous conversation: ${interview.conversationHistory
        .map((c) => `${c.role}: ${c.content}`)
        .join("\n")}

Generate the next interview question that:
1. Is appropriate for ${interview.level} level
2. Builds on previous responses
3. Is specific and actionable
4. Helps assess job readiness

Return only the question, no additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      question = response.text();
    } catch (aiError) {
      console.error("AI question generation failed:", aiError);
      // Fallback questions
      const fallbackQuestions = {
        "software-engineer": [
          "Can you walk me through a challenging technical problem you solved?",
          "How do you approach debugging a production issue?",
          "Describe a time when you had to learn a new technology quickly.",
        ],
        "product-manager": [
          "How do you prioritize features in a product roadmap?",
          "Describe a product launch that didn't go as planned.",
          "How do you gather and validate user requirements?",
        ],
        "data-scientist": [
          "How do you validate the results of a machine learning model?",
          "Describe a data analysis project that led to actionable insights.",
          "How do you handle missing or inconsistent data?",
        ],
      };

      const questions =
        fallbackQuestions[interview.role] ||
        fallbackQuestions["software-engineer"];
      question = questions[Math.floor(Math.random() * questions.length)];
    }

    // Add AI question to conversation
    interview.conversationHistory.push({
      role: "interviewer",
      content: question,
      timestamp: new Date(),
    });

    await interview.save();

    res.json({ question });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ message: "Error generating question" });
  }
});

// End interview and generate final assessment
router.post("/:id/end", auth, async (req, res) => {
  try {
    const { duration } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Calculate overall score
    const totalScore = interview.questions.reduce((sum, q) => sum + q.score, 0);
    const averageScore =
      interview.questions.length > 0
        ? Math.round(totalScore / interview.questions.length)
        : 0;

    // Generate final assessment
    let results = {
      overallScore: averageScore,
      strengths: ["Good communication", "Technical knowledge"],
      improvements: ["More specific examples", "Better time management"],
      readiness: "almost ready",
      recommendations: ["Practice more", "Study industry trends"],
      duration,
    };

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Based on this interview conversation, provide a final assessment:

Conversation: ${interview.conversationHistory
        .map((c) => `${c.role}: ${c.content}`)
        .join("\n")}
Role: ${interview.role}
Level: ${interview.level}
Duration: ${duration} seconds
Average Score: ${averageScore}

Provide a comprehensive final assessment including:
1. Key strengths demonstrated
2. Areas for improvement
3. Job readiness assessment
4. Specific recommendations

Format as JSON:
{
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "readiness": "ready/almost ready/needs work",
  "recommendations": ["rec1", "rec2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const assessment = JSON.parse(response.text());

      results = {
        ...results,
        ...assessment,
      };
    } catch (aiError) {
      console.error("AI assessment generation failed:", aiError);
    }

    // Update interview
    interview.status = "completed";
    interview.results = results;
    interview.completedAt = new Date();

    await interview.save();

    res.json(interview);
  } catch (error) {
    console.error("Error ending interview:", error);
    res.status(500).json({ message: "Error ending interview" });
  }
});

// Get interview statistics
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const stats = await Interview.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          completedInterviews: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          averageScore: { $avg: "$results.overallScore" },
          totalDuration: { $sum: "$results.duration" },
        },
      },
    ]);

    const typeStats = await Interview.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          averageScore: { $avg: "$results.overallScore" },
        },
      },
    ]);

    res.json({
      overview: stats[0] || {
        totalInterviews: 0,
        completedInterviews: 0,
        averageScore: 0,
        totalDuration: 0,
      },
      byType: typeStats,
    });
  } catch (error) {
    console.error("Error fetching interview stats:", error);
    res.status(500).json({ message: "Error fetching interview statistics" });
  }
});

// Delete interview
router.delete("/:id", auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ message: "Error deleting interview" });
  }
});

module.exports = router;
