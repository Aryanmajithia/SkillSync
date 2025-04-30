import express from "express";
import { requireAuth } from "../middleware/auth.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", requireAuth, notificationController.getNotifications);

// Get unread notification count
router.get("/unread/count", requireAuth, notificationController.getUnreadCount);

// Mark a notification as read
router.patch("/:id/read", requireAuth, notificationController.markAsRead);

// Mark all notifications as read
router.patch("/read-all", requireAuth, notificationController.markAllAsRead);

// Delete a notification
router.delete("/:id", requireAuth, notificationController.deleteNotification);

export default router;
