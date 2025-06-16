import api from "../lib/axios";

export const jobService = {
  // Get all jobs with filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/api/jobs?${params.toString()}`);
    return response.data;
  },

  // Get single job by ID
  getJob: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data;
  },

  // Create new job (employer only)
  createJob: async (jobData) => {
    const response = await api.post("/api/jobs", jobData);
    return response.data;
  },

  // Update job (employer only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/api/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job (employer only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data;
  },

  // Get job recommendations
  getRecommendations: async (userId) => {
    const response = await api.get(`/api/ai/job-recommendations/${userId}`);
    return response.data;
  },

  // Get salary insights
  getSalaryInsights: async (jobTitle, location) => {
    const response = await api.get("/api/ai/salary-insights", {
      params: { jobTitle, location },
    });
    return response.data;
  },

  // Fetch external jobs from public APIs
  searchExternalJobs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        query: params.query || "software developer",
        location: params.location || "United States",
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await fetch(`/api/jobs/search/external?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch external jobs");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching external jobs:", error);
      throw error;
    }
  },
};
