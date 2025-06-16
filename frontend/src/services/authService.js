import api from "../lib/axios";

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Set auth token
  setToken: (token) => {
    localStorage.setItem("token", token);
  },
};
