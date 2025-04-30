import axios from "axios";

const API_URL = "/api/notifications";

export const notificationService = {
  getNotifications: async (type = "all") => {
    const response = await axios.get(`${API_URL}?type=${type}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(`${API_URL}/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put(`${API_URL}/read-all`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axios.delete(`${API_URL}/${notificationId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axios.get(`${API_URL}/unread-count`);
    return response.data;
  },
};
