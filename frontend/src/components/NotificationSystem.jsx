import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell, Check, X, MessageSquare, Briefcase } from "lucide-react";
import { toast } from "react-hot-toast";

const NotificationSystem = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get("/api/notifications");
      return response.data;
    },
  });

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No notifications
        </h3>
        <p className="mt-2 text-gray-500">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
      </div>
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              !notification.read ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
                {notification.link && (
                  <Link
                    to={notification.link}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                  >
                    View Details
                  </Link>
                )}
              </div>
              <div className="flex-shrink-0">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;
