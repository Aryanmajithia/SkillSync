const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get user profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("profile.skills profile.experience profile.education");

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/", auth, async (req, res) => {
  try {
    const { name, profile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, profile },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// Add experience
router.post("/experience", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.profile.experience.push(req.body);
    await user.save();

    res.json(user.profile.experience);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding experience", error: error.message });
  }
});

// Add education
router.post("/education", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.profile.education.push(req.body);
    await user.save();

    res.json(user.profile.education);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding education", error: error.message });
  }
});

// Update skills
router.put("/skills", auth, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findById(req.user.userId);
    user.profile.skills = skills;
    await user.save();

    res.json(user.profile.skills);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating skills", error: error.message });
  }
});

module.exports = router;
