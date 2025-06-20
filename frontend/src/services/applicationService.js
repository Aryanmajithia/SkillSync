import api from "../lib/axios";

export const applicationService = {
  // Check server health
  checkServerHealth: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Server health check failed:", error);
      throw error;
    }
  },

  // Submit job application
  submitApplication: async (applicationData) => {
    console.log(
      "applicationService.submitApplication called with:",
      applicationData
    );
    console.log("applicationData type:", typeof applicationData);
    console.log(
      "applicationData constructor:",
      applicationData.constructor.name
    );

    try {
      const response = await api.post("/api/applications", applicationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API response:", response);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get("/api/applications");
    return response.data;
  },

  // Get applications for a job (employer only)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/api/applications/job/${jobId}`);
    return response.data;
  },

  // Update application status (employer only)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(
      `/api/applications/${applicationId}/status`,
      {
        status,
      }
    );
    return response.data;
  },

  // Get application by ID
  getApplication: async (applicationId) => {
    const response = await api.get(`/api/applications/${applicationId}`);
    return response.data;
  },
};
