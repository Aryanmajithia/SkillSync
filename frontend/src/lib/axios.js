import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://skillsync-backend-opqm.onrender.com"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "[Axios] Request to:",
      config.url,
      "Token:",
      token ? token : "none"
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "[Axios] Authorization header set:",
        config.headers.Authorization
      );
    } else {
      console.log("[Axios] No Authorization header set.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
