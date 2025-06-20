const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const Chat = require("../models/Chat");
const User = require("../models/User");

// Get dashboard statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get application count
    const applications = await Application.countDocuments({ userId });

    // Get unread notifications count
    const notifications = await Notification.countDocuments({
      userId,
      read: false,
    });

    // Get unread messages count
    const messages = await Chat.countDocuments({
      participants: userId,
      "messages.read": false,
      "messages.sender": { $ne: userId },
    });

    // Get recent activity
    const recentApplications = await Application.find({ userId })
      .populate("jobId", "title company")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get profile completion percentage
    const user = await User.findById(userId);
    let profileCompletion = 0;
    if (user) {
      const fields = [
        user.fullName,
        user.title,
        user.bio,
        user.skills?.length > 0,
        user.location,
        user.experience?.length > 0,
        user.education?.length > 0,
      ];
      profileCompletion = Math.round(
        (fields.filter(Boolean).length / fields.length) * 100
      );
    }

    res.json({
      applications,
      notifications,
      messages,
      profileCompletion,
      recentApplications,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
});

// Get recent activity
router.get("/activity", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recent applications
    const recentApplications = await Application.find({ userId })
      .populate("jobId", "title company")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent notifications
    const recentNotifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent messages
    const recentMessages = await Chat.find({
      participants: userId,
    })
      .populate("participants", "fullName")
      .sort({ updatedAt: -1 })
      .limit(5);

    const activity = [
      ...recentApplications.map((app) => ({
        type: "application",
        data: app,
        timestamp: app.createdAt,
      })),
      ...recentNotifications.map((notif) => ({
        type: "notification",
        data: notif,
        timestamp: notif.createdAt,
      })),
      ...recentMessages.map((chat) => ({
        type: "message",
        data: chat,
        timestamp: chat.updatedAt,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    res.json(activity.slice(0, 20));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Failed to fetch recent activity" });
  }
});

// Get quick stats for sidebar
router.get("/quick-stats", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalApplications,
      pendingApplications,
      interviewsScheduled,
      unreadNotifications,
    ] = await Promise.all([
      Application.countDocuments({ userId }),
      Application.countDocuments({ userId, status: "applied" }),
      Application.countDocuments({ userId, status: "interview" }),
      Notification.countDocuments({ userId, read: false }),
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      interviewsScheduled,
      unreadNotifications,
    });
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    res.status(500).json({ message: "Failed to fetch quick statistics" });
  }
});

// Employer Overview
router.get("/analytics/employer/overview", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map((j) => j._id);
    const totalJobs = jobs.length;
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });
    const totalHires = await Application.countDocuments({
      job: { $in: jobIds },
      status: "hired",
    });
    const totalActive = await Job.countDocuments({
      createdBy: req.user.id,
      status: "active",
    });
    res.json({ totalJobs, totalApplications, totalHires, totalActive });
  } catch (err) {
    res.status(500).json({ message: "Error fetching overview analytics" });
  }
});

// Job Performance
router.get("/analytics/employer/jobs", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    const jobStats = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id });
        const hires = applications.filter((a) => a.status === "hired").length;
        const timeToFill =
          hires > 0
            ? (new Date(
                applications.find((a) => a.status === "hired").updatedAt
              ) -
                new Date(job.createdAt)) /
              (1000 * 60 * 60 * 24)
            : null;
        return {
          jobId: job._id,
          title: job.title,
          status: job.status,
          applications: applications.length,
          hires,
          timeToFill,
        };
      })
    );
    res.json(jobStats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job analytics" });
  }
});

// Application Funnel
router.get("/analytics/employer/applications", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map((j) => j._id);
    const statuses = ["applied", "interviewing", "hired", "rejected"];
    const funnel = {};
    for (const status of statuses) {
      funnel[status] = await Application.countDocuments({
        job: { $in: jobIds },
        status,
      });
    }
    res.json(funnel);
  } catch (err) {
    res.status(500).json({ message: "Error fetching application funnel" });
  }
});

// Market Trends
router.get("/analytics/market", async (req, res) => {
  try {
    // Top roles
    const topRoles = await Job.aggregate([
      { $group: { _id: "$title", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    // Salary trends
    const salaryStats = await Job.aggregate([
      { $match: { salary: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: null,
          avg: { $avg: { $toDouble: "$salary" } },
          min: { $min: { $toDouble: "$salary" } },
          max: { $max: { $toDouble: "$salary" } },
        },
      },
    ]);
    // Demand by location
    const topLocations = await Job.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    // Demand by skill (if requirements is a comma-separated string)
    const topSkills = await Job.aggregate([
      { $project: { skills: { $split: ["$requirements", ","] } } },
      { $unwind: "$skills" },
      { $group: { _id: { $trim: { input: "$skills" } }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      topRoles,
      salaryStats: salaryStats[0],
      topLocations,
      topSkills,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching market trends" });
  }
});

module.exports = router;
