const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserSettings = require("../models/UserSettings");

// Get user settings
router.get("/", auth, async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user.id });

    if (!settings) {
      // Create default settings
      settings = new UserSettings({
        userId: req.user.id,
        notifications: {
          email: true,
          push: true,
          applicationUpdates: true,
          jobRecommendations: true,
          interviewReminders: true,
        },
        privacy: {
          profileVisibility: "public",
          showContactInfo: true,
          showApplications: false,
        },
        preferences: {
          jobAlerts: true,
          salaryRange: {
            min: 0,
            max: 200000,
          },
          preferredLocations: [],
          jobTypes: ["full-time", "part-time", "contract"],
          experienceLevel: "all",
        },
        features: {
          premiumAccess: false,
          aiResumeAnalysis: true,
          jobRecommendations: true,
          interviewPrep: true,
        },
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ message: "Failed to fetch user settings" });
  }
});

// Update user settings
router.put("/", auth, async (req, res) => {
  try {
    const { notifications, privacy, preferences, features } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          ...(notifications && { notifications }),
          ...(privacy && { privacy }),
          ...(preferences && { preferences }),
          ...(features && { features }),
        },
      },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ message: "Failed to update user settings" });
  }
});

module.exports = router;
