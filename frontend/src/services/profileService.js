import api from "../lib/axios";

export const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/api/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/api/profile", profileData);
    return response.data;
  },

  // Add experience
  addExperience: async (experienceData) => {
    const response = await api.post("/api/profile/experience", experienceData);
    return response.data;
  },

  // Add education
  addEducation: async (educationData) => {
    const response = await api.post("/api/profile/education", educationData);
    return response.data;
  },

  // Update skills
  updateSkills: async (skills) => {
    const response = await api.put("/api/profile/skills", { skills });
    return response.data;
  },

  // Get career path suggestions
  getCareerPath: async (userId) => {
    const response = await api.get(`/api/ai/career-path/${userId}`);
    return response.data;
  },

  // Get interview tips
  getInterviewTips: async (jobId) => {
    const response = await api.get(`/api/ai/interview-tips/${jobId}`);
    return response.data;
  },
};
