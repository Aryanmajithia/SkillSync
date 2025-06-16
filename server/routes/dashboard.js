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

module.exports = router;
