import Notification from "../models/Notification.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    const query = { user: req.user._id };

    if (type !== "all") {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: "Error getting notifications" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user._id);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ message: "Error marking all notifications as read" });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
