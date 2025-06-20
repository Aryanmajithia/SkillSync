import axios from "../lib/axios";

// AI-powered job recommendations
export const getJobRecommendations = async (userId) => {
  try {
    const response = await axios.get(`/api/ai/job-recommendations/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    throw error;
  }
};

// AI-powered candidate ranking for employers
export const getCandidateRanking = async (jobId) => {
  try {
    const response = await axios.post(`/api/ai/candidate-ranking/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting candidate ranking:", error);
    throw error;
  }
};

// AI-powered resume analysis
export const analyzeResume = async (resumeFile) => {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await axios.post("/api/ai/analyze-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

// AI-powered interview questions generation
export const generateInterviewQuestions = async (jobData) => {
  try {
    const response = await axios.post(
      "/api/ai/generate-interview-questions",
      jobData
    );
    return response.data;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw error;
  }
};

// AI-powered salary insights
export const getSalaryInsights = async (jobTitle, location, experience) => {
  try {
    const params = new URLSearchParams({
      jobTitle,
      location,
      experience,
    });
    const response = await axios.get(`/api/ai/salary-insights?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error getting salary insights:", error);
    throw error;
  }
};

// AI-powered job description generation
export const generateJobDescription = async (jobData) => {
  try {
    const response = await axios.post(
      "/api/jobs/generate-job-description",
      jobData
    );
    return response.data;
  } catch (error) {
    console.error("Error generating job description:", error);
    throw error;
  }
};

// AI-powered job requirements optimization
export const optimizeJobRequirements = async (requirementsData) => {
  try {
    const response = await axios.post(
      "/api/jobs/optimize-requirements",
      requirementsData
    );
    return response.data;
  } catch (error) {
    console.error("Error optimizing requirements:", error);
    throw error;
  }
};

// AI-powered salary benchmarking
export const getSalaryBenchmark = async (benchmarkData) => {
  try {
    const response = await axios.post(
      "/api/jobs/salary-benchmark",
      benchmarkData
    );
    return response.data;
  } catch (error) {
    console.error("Error getting salary benchmark:", error);
    throw error;
  }
};

// AI-powered application analysis
export const analyzeApplication = async (applicationData) => {
  try {
    const response = await axios.post(
      "/api/ai/analyze-application",
      applicationData
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing application:", error);
    throw error;
  }
};

// AI-powered skill gap analysis
export const analyzeSkillGap = async (userSkills, jobRequirements) => {
  try {
    const response = await axios.post("/api/ai/skill-gap-analysis", {
      userSkills,
      jobRequirements,
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    throw error;
  }
};

// AI-powered career path suggestions
export const getCareerPathSuggestions = async (userProfile) => {
  try {
    const response = await axios.post(
      "/api/ai/career-path-suggestions",
      userProfile
    );
    return response.data;
  } catch (error) {
    console.error("Error getting career path suggestions:", error);
    throw error;
  }
};

// AI-powered interview feedback
export const generateInterviewFeedback = async (interviewData) => {
  try {
    const response = await axios.post(
      "/api/ai/interview-feedback",
      interviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    throw error;
  }
};

// AI-powered job market insights
export const getMarketInsights = async (industry, location) => {
  try {
    const params = new URLSearchParams({
      industry,
      location,
    });
    const response = await axios.get(`/api/ai/market-insights?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error getting market insights:", error);
    throw error;
  }
};

// AI-powered application optimization suggestions
export const getApplicationOptimization = async (applicationData) => {
  try {
    const response = await axios.post(
      "/api/ai/application-optimization",
      applicationData
    );
    return response.data;
  } catch (error) {
    console.error("Error getting application optimization:", error);
    throw error;
  }
};

// AI-powered company culture analysis
export const analyzeCompanyCulture = async (companyData) => {
  try {
    const response = await axios.post(
      "/api/ai/company-culture-analysis",
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing company culture:", error);
    throw error;
  }
};

// AI-powered negotiation tips
export const getNegotiationTips = async (jobData, userProfile) => {
  try {
    const response = await axios.post("/api/ai/negotiation-tips", {
      jobData,
      userProfile,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting negotiation tips:", error);
    throw error;
  }
};

// AI-powered job search optimization
export const optimizeJobSearch = async (searchCriteria, userProfile) => {
  try {
    const response = await axios.post("/api/ai/job-search-optimization", {
      searchCriteria,
      userProfile,
    });
    return response.data;
  } catch (error) {
    console.error("Error optimizing job search:", error);
    throw error;
  }
};

// AI-powered resume optimization
export const optimizeResume = async (resumeData, targetJob) => {
  try {
    const response = await axios.post("/api/ai/resume-optimization", {
      resumeData,
      targetJob,
    });
    return response.data;
  } catch (error) {
    console.error("Error optimizing resume:", error);
    throw error;
  }
};

// AI-powered cover letter generation
export const generateCoverLetter = async (userProfile, jobData) => {
  try {
    const response = await axios.post("/api/ai/generate-cover-letter", {
      userProfile,
      jobData,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw error;
  }
};

// AI-powered networking suggestions
export const getNetworkingSuggestions = async (userProfile, targetIndustry) => {
  try {
    const response = await axios.post("/api/ai/networking-suggestions", {
      userProfile,
      targetIndustry,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting networking suggestions:", error);
    throw error;
  }
};

// AI-powered interview preparation
export const getInterviewPreparation = async (jobData, userProfile) => {
  try {
    const response = await axios.post("/api/ai/interview-preparation", {
      jobData,
      userProfile,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting interview preparation:", error);
    throw error;
  }
};

// AI-powered job satisfaction prediction
export const predictJobSatisfaction = async (jobData, userProfile) => {
  try {
    const response = await axios.post("/api/ai/job-satisfaction-prediction", {
      jobData,
      userProfile,
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting job satisfaction:", error);
    throw error;
  }
};

// AI-powered company research
export const researchCompany = async (companyName) => {
  try {
    const response = await axios.post("/api/ai/company-research", {
      companyName,
    });
    return response.data;
  } catch (error) {
    console.error("Error researching company:", error);
    throw error;
  }
};

// AI-powered job application strategy
export const getApplicationStrategy = async (userProfile, targetJobs) => {
  try {
    const response = await axios.post("/api/ai/application-strategy", {
      userProfile,
      targetJobs,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting application strategy:", error);
    throw error;
  }
};

// AI-powered skill development recommendations
export const getSkillDevelopmentRecommendations = async (
  userProfile,
  targetRole
) => {
  try {
    const response = await axios.post(
      "/api/ai/skill-development-recommendations",
      {
        userProfile,
        targetRole,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting skill development recommendations:", error);
    throw error;
  }
};

// AI-powered job match analysis
export const analyzeJobMatch = async (data) => {
  try {
    const response = await axios.post("/api/ai/analyze-job-match", data);
    return response.data;
  } catch (error) {
    console.error("Error analyzing job match:", error);
    throw error;
  }
};

// AI-powered market trend analysis
export const getMarketTrends = async (industry, location) => {
  try {
    const params = new URLSearchParams({
      industry,
      location,
    });
    const response = await axios.get(`/api/ai/market-trends?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error getting market trends:", error);
    throw error;
  }
};

// AI-powered skill demand analysis
export const getSkillDemand = async (industry, location) => {
  try {
    const params = new URLSearchParams({
      industry,
      location,
    });
    const response = await axios.get(`/api/ai/skill-demand?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error getting skill demand:", error);
    throw error;
  }
};
