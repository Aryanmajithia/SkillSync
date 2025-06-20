const mongoose = require("mongoose");
const User = require("../models/User");
const Application = require("../models/Application");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const Notification = require("../models/Notification");
const UserSettings = require("../models/UserSettings");
require("dotenv").config();

async function runMigrations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Migration 1: Update Users with new AI matching fields
    console.log("Updating Users with AI matching fields...");
    const userUpdateResult = await User.updateMany(
      {
        $or: [
          { skills: { $exists: false } },
          { experience: { $exists: false } },
          { salaryExpectations: { $exists: false } },
          { location: { $exists: false } },
        ],
      },
      {
        $set: {
          skills: "",
          experience: "",
          salaryExpectations: "",
          location: "",
        },
      }
    );
    console.log(`Updated ${userUpdateResult.modifiedCount} users`);

    // Migration 2: Update Applications with appliedDate
    console.log("Updating Applications with appliedDate...");
    const applicationUpdateResult = await Application.updateMany(
      { appliedDate: { $exists: false } },
      {
        $set: {
          appliedDate: new Date(),
        },
      }
    );
    console.log(
      `Updated ${applicationUpdateResult.modifiedCount} applications`
    );

    // Migration 3: Update ResumeAnalysis with atsScore
    console.log("Updating ResumeAnalysis with atsScore...");
    const resumeUpdateResult = await ResumeAnalysis.updateMany(
      { atsScore: { $exists: false } },
      {
        $set: {
          atsScore: 0,
        },
      }
    );
    console.log(`Updated ${resumeUpdateResult.modifiedCount} resume analyses`);

    // Migration 4: Update Notifications with email fields
    console.log("Updating Notifications with email fields...");
    const notificationUpdateResult = await Notification.updateMany(
      {
        $or: [
          { emailSent: { $exists: false } },
          { emailSentAt: { $exists: false } },
        ],
      },
      {
        $set: {
          emailSent: false,
          emailSentAt: null,
        },
      }
    );
    console.log(
      `Updated ${notificationUpdateResult.modifiedCount} notifications`
    );

    // Migration 5: Update UserSettings with email preferences
    console.log("Updating UserSettings with email preferences...");
    const settingsUpdateResult = await UserSettings.updateMany(
      { emailNotifications: { $exists: false } },
      {
        $set: {
          emailNotifications: {
            applications: true,
            interviews: true,
            statusUpdates: true,
            jobMatches: true,
            weeklyDigest: true,
          },
        },
      }
    );
    console.log(`Updated ${settingsUpdateResult.modifiedCount} user settings`);

    // Migration 6: Update existing resume analyses to calculate ATS scores
    console.log("Calculating ATS scores for existing resume analyses...");
    const resumeAnalyses = await ResumeAnalysis.find({ atsScore: 0 });

    for (const analysis of resumeAnalyses) {
      // Calculate a basic ATS score based on existing data
      let score = 0;

      if (
        analysis.keywordAnalysis &&
        analysis.keywordAnalysis.matchedKeywords
      ) {
        score += Math.min(
          analysis.keywordAnalysis.matchedKeywords.length * 10,
          40
        );
      }

      if (analysis.suggestions && analysis.suggestions.length < 5) {
        score += 30; // Fewer suggestions = better score
      }

      if (analysis.overallScore) {
        score += analysis.overallScore * 0.3;
      }

      // Ensure score is between 0-100
      score = Math.min(Math.max(score, 0), 100);

      await ResumeAnalysis.findByIdAndUpdate(analysis._id, {
        atsScore: Math.round(score),
      });
    }
    console.log(
      `Updated ATS scores for ${resumeAnalyses.length} resume analyses`
    );

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
