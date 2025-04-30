import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import ApplicationTracker from "../components/ApplicationTracker";
import JobRecommendations from "../components/JobRecommendations";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import AIJobMatcher from "../components/AIJobMatcher";
import { Briefcase, Bell, MessageSquare, User, Sparkles } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/stats");
      return response.data;
    },
  });

  const handleResumeAnalysis = (analysisData) => {
    // Handle resume analysis results
    console.log("Resume analysis results:", analysisData);
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome back, {user?.name}!
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.applications || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.notifications || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Messages</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.messages || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResumeAnalyzer onAnalysisComplete={handleResumeAnalysis} />
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Career Insights
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Get personalized career recommendations and skill development
                tips.
              </p>
              <Link
                to="/career-insights"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                View Career Insights
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Application Tracker */}
          <ApplicationTracker />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/jobs"
                className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
              >
                <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                  <p className="text-sm text-gray-500">
                    Find your next opportunity
                  </p>
                </div>
              </Link>
              <Link
                to="/profile"
                className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
              >
                <User className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Update Profile</h3>
                  <p className="text-sm text-gray-500">
                    Keep your profile up to date
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <AIJobMatcher />
          <JobRecommendations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
