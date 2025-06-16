import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiService } from "../services/aiService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Search, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const JobSpecificATS = ({ resumeAnalysis }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobMatch = useMutation({
    mutationFn: async (data) => {
      const result = await aiService.analyzeJobMatch(data);
      return result;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success("Job-specific analysis completed!");
    },
    onError: (error) => {
      toast.error("Failed to analyze job match. Please try again.");
    },
  });

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !jobTitle.trim()) {
      toast.error("Please provide both job title and description");
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeJobMatch.mutateAsync({
        jobTitle,
        jobDescription,
        resumeAnalysis,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getMatchScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-yellow-100";
    if (score >= 70) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Job-Specific ATS Analysis
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        Analyze how well your resume matches a specific job posting.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={6}
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim() || !jobTitle.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyze Job Match
            </>
          )}
        </Button>
      </div>

      {analysisResult && (
        <div className="space-y-6">
          {/* Match Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Target className="w-6 h-6 text-purple-600" />
              <span
                className={`text-2xl font-bold ${getMatchScoreColor(
                  analysisResult.matchScore
                )}`}
              >
                {analysisResult.matchScore}% Match
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getMatchScoreBgColor(
                  analysisResult.matchScore
                )}`}
                style={{ width: `${analysisResult.matchScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysisResult.matchScore >= 90
                ? "Excellent match! Your resume aligns well with this position."
                : analysisResult.matchScore >= 80
                ? "Good match. Consider some minor adjustments."
                : analysisResult.matchScore >= 70
                ? "Fair match. Several improvements needed."
                : "Poor match. Significant changes recommended."}
            </p>
          </div>

          {/* Matching Skills */}
          {analysisResult.matchingSkills &&
            analysisResult.matchingSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Matching Skills ({analysisResult.matchingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Missing Skills */}
          {analysisResult.missingSkills &&
            analysisResult.missingSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Missing Skills ({analysisResult.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
          {analysisResult.recommendations &&
            analysisResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {analysisResult.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <p className="text-sm text-gray-700">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default JobSpecificATS;
