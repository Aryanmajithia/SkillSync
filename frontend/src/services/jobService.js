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

    // Fetch real jobs
    const realJobsResponse = await api.get(`/api/jobs?${params.toString()}`);
    let realJobs = realJobsResponse.data;
    // If the response is paginated, extract jobs array
    if (realJobs && realJobs.jobs) realJobs = realJobs.jobs;
    // Fetch mock jobs
    let mockJobs = [];
    try {
      const mockJobsResponse = await api.get("/api/ai/jobs-mock");
      mockJobs = mockJobsResponse.data;
    } catch (e) {
      mockJobs = [];
    }
    // Merge and return all jobs
    return [
      ...(Array.isArray(realJobs) ? realJobs : []),
      ...(Array.isArray(mockJobs) ? mockJobs : []),
    ];
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

  // Get jobs posted by current employer
  getMyPostedJobs: async () => {
    const response = await api.get("/api/jobs/my-jobs");
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

export const createJobTemplate = (templateName, jobData) =>
  api.post("/api/jobs/templates", { templateName, jobData });

export const getJobTemplates = () => api.get("/api/jobs/templates");

export const updateJobTemplate = (id, templateName, jobData) =>
  api.put(`/api/jobs/templates/${id}`, { templateName, jobData });

export const deleteJobTemplate = (id) =>
  api.delete(`/api/jobs/templates/${id}`);

export const bulkImportJobs = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/jobs/bulk-import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const scheduleJob = (id, scheduledAt) =>
  api.put(`/api/jobs/${id}/schedule`, { scheduledAt });

// Analytics functions
export const getEmployerOverview = async () => {
  const response = await api.get("/api/analytics/employer-overview");
  return response.data;
};

export const getJobPerformance = async () => {
  const response = await api.get("/api/analytics/job-performance");
  return response.data;
};

export const getApplicationFunnel = async () => {
  const response = await api.get("/api/analytics/application-funnel");
  return response.data;
};

export const getMarketTrends = async () => {
  const response = await api.get("/api/analytics/market-trends");
  return response.data;
};
