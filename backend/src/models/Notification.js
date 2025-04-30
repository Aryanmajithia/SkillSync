import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "connection", "skill", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// Static method to create a notification
notificationSchema.statics.createNotification = async function (
  userId,
  type,
  title,
  message,
  data = {}
) {
  const notification = new this({
    user: userId,
    type,
    title,
    message,
    data,
  });
  await notification.save();
  return notification;
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, read: false });
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
