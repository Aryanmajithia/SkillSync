import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: async () => {
      const response = await axios.get(`/api/notifications?type=${filter}`);
      return response.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const response = await axios.put(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/notifications/read-all");
      return response.data;
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId) => {
      const response = await axios.delete(
        `/api/notifications/${notificationId}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-md ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            className="text-blue-600 hover:text-blue-900"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className={`bg-white p-4 rounded-lg shadow-sm ${
              !notification.read ? "border-l-4 border-blue-600" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {notification.type === "application"
                      ? "📝"
                      : notification.type === "message"
                      ? "💬"
                      : notification.type === "job"
                      ? "💼"
                      : "📢"}
                  </div>
                </div>
                <div>
                  <p className="text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification._id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() =>
                    deleteNotificationMutation.mutate(notification._id)
                  }
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            {notification.link && (
              <div className="mt-2">
                <a
                  href={notification.link}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details →
                </a>
              </div>
            )}
          </div>
        ))}

        {notifications?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
}
