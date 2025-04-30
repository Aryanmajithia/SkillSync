import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error getting user profile" });
  }
});

// Update user profile
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

export default router;
