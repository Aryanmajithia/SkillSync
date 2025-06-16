import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Clock,
  TrendingUp,
  MessageSquare,
  FileText,
  Target,
  Award,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: interview, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: async () => {
      const response = await axios.get(`/api/interviews/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Interview not found
        </h2>
        <p className="mt-2 text-gray-600">
          The interview you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/interviews")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-yellow-100";
    if (score >= 70) return "bg-orange-100";
    return "bg-red-100";
  };

  const getOverallRating = () => {
    const scores = [
      interview.technicalScore,
      interview.communicationScore,
      interview.problemSolvingScore,
      interview.culturalFitScore,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Results
              </h1>
              <p className="text-gray-600 mt-1">
                {interview.jobTitle} at {interview.company}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(interview.scheduledAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {interview.duration} minutes
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {interview.interviewer}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  getOverallRating()
                )}`}
              >
                {getOverallRating()}/100
              </div>
              <div
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getScoreBgColor(
                  getOverallRating()
                )} ${getScoreColor(getOverallRating())}`}
              >
                {getOverallRating() >= 90
                  ? "Excellent"
                  : getOverallRating() >= 80
                  ? "Good"
                  : getOverallRating() >= 70
                  ? "Fair"
                  : "Needs Improvement"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: Target },
                { id: "technical", label: "Technical", icon: FileText },
                {
                  id: "communication",
                  label: "Communication",
                  icon: MessageSquare,
                },
                {
                  id: "feedback",
                  label: "Detailed Feedback",
                  icon: TrendingUp,
                },
                {
                  id: "recommendations",
                  label: "Recommendations",
                  icon: Award,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Technical</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            interview.technicalScore
                          )}`}
                        >
                          {interview.technicalScore}/100
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <Progress
                      value={interview.technicalScore}
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Communication</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            interview.communicationScore
                          )}`}
                        >
                          {interview.communicationScore}/100
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <Progress
                      value={interview.communicationScore}
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Problem Solving</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            interview.problemSolvingScore
                          )}`}
                        >
                          {interview.problemSolvingScore}/100
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <Progress
                      value={interview.problemSolvingScore}
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Cultural Fit</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            interview.culturalFitScore
                          )}`}
                        >
                          {interview.culturalFitScore}/100
                        </p>
                      </div>
                      <User className="w-8 h-8 text-orange-600" />
                    </div>
                    <Progress
                      value={interview.culturalFitScore}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Strengths
                    </h3>
                    <div className="space-y-2">
                      {interview.strengths?.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Areas for Improvement
                    </h3>
                    <div className="space-y-2">
                      {interview.areasForImprovement?.map((area, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Tab */}
            {activeTab === "technical" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Questions Asked
                      </h4>
                      <div className="space-y-2">
                        {interview.technicalQuestions?.map(
                          (question, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-700 bg-white p-3 rounded border"
                            >
                              {question}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Your Responses
                      </h4>
                      <div className="space-y-2">
                        {interview.technicalResponses?.map(
                          (response, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-700 bg-white p-3 rounded border"
                            >
                              {response}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Feedback
                  </h3>
                  <p className="text-gray-700">{interview.technicalFeedback}</p>
                </div>
              </div>
            )}

            {/* Communication Tab */}
            {activeTab === "communication" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Communication Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {interview.communicationScore}
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {interview.clarityScore || 85}
                      </div>
                      <div className="text-sm text-gray-600">Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {interview.confidenceScore || 80}
                      </div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {interview.communicationFeedback}
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Feedback Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Feedback
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      {interview.detailedFeedback}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Interview Notes
                    </h3>
                    <div className="space-y-2">
                      {interview.interviewNotes?.map((note, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-700 bg-gray-50 p-3 rounded"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Follow-up Actions
                    </h3>
                    <div className="space-y-2">
                      {interview.followUpActions?.map((action, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === "recommendations" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personalized Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Skills to Develop
                      </h4>
                      <div className="space-y-2">
                        {interview.skillRecommendations?.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Resources
                      </h4>
                      <div className="space-y-2">
                        {interview.resources?.map((resource, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Next Steps
                  </h3>
                  <div className="space-y-3">
                    {interview.nextSteps?.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/interviews")}>
            Back to Interviews
          </Button>
          <div className="flex gap-3">
            <Button onClick={() => navigate(`/interviews/${id}/practice`)}>
              Practice Similar Questions
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/interviews/${id}/share`)}
            >
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
