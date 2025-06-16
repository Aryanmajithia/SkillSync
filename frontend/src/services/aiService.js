import api from "../lib/axios";

const AI_API_URL =
  import.meta.env.VITE_AI_API_URL || "http://localhost:5000/api/ai";

export const aiService = {
  // Analyze resume and extract skills
  analyzeResume: async (resumeFile) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await api.post(`${AI_API_URL}/analyze-resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get job recommendations based on user profile
  getJobRecommendations: async (userId) => {
    const response = await api.get(
      `${AI_API_URL}/job-recommendations/${userId}`
    );
    return response.data;
  },

  // Get skill suggestions based on job description
  getSkillSuggestions: async (jobDescription) => {
    const response = await api.post(`${AI_API_URL}/skill-suggestions`, {
      jobDescription,
    });
    return response.data;
  },

  // Analyze job description and extract requirements
  analyzeJobDescription: async (jobDescription) => {
    const response = await api.post(`${AI_API_URL}/analyze-job`, {
      jobDescription,
    });
    return response.data;
  },

  // Get personalized career path suggestions
  getCareerPathSuggestions: async (userId) => {
    const response = await api.get(`${AI_API_URL}/career-path/${userId}`);
    return response.data;
  },

  // Get interview preparation tips
  getInterviewTips: async (jobId) => {
    const response = await api.get(`${AI_API_URL}/interview-tips/${jobId}`);
    return response.data;
  },

  // Get salary insights
  getSalaryInsights: async (jobTitle, location) => {
    const response = await api.get(`${AI_API_URL}/salary-insights`, {
      params: { jobTitle, location },
    });
    return response.data;
  },

  // Analyze job match for resume
  analyzeJobMatch: async (data) => {
    const response = await api.post(`${AI_API_URL}/job-match`, data);
    return response.data;
  },
};
