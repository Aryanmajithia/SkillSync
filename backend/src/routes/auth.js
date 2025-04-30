import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  verifyToken,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate-request.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Register route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
    body("role")
      .isIn(["freelancer", "client"])
      .withMessage("Role must be either freelancer or client"),
  ],
  validateRequest,
  register
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

// Logout route
router.post("/logout", logout);

// Verify token route
router.get("/verify", verifyToken);

// Get current user
router.get("/me", verifyToken);

export default router;
