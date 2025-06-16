import api from "../lib/axios";

export const applicationService = {
  // Submit job application
  submitApplication: async (applicationData) => {
    const formData = new FormData();

    // Append all form data
    Object.keys(applicationData).forEach((key) => {
      if (applicationData[key] !== null && applicationData[key] !== undefined) {
        formData.append(key, applicationData[key]);
      }
    });

    const response = await api.post("/api/applications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
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
