import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeResume } from "../services/aiService";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import ATSScore from "./ATSScore";
import ImprovementSuggestions from "./ImprovementSuggestions";
import JobSpecificATS from "./JobSpecificATS";

const ResumeAnalyzer = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeResume = useMutation({
    mutationFn: async (file) => {
      const result = await analyzeResume(file);
      return result;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success("Resume analyzed successfully!");
      onAnalysisComplete(data);
    },
    onError: (error) => {
      toast.error("Failed to analyze resume. Please try again.");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Resume file size should be less than 5MB");
        return;
      }
      setResumeFile(file);
      setAnalysisResult(null); // Clear previous results
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeResume.mutateAsync(resumeFile);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Resume Upload and Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI Resume Analyzer
        </h2>
        <p className="text-gray-600 mb-6">
          Upload your resume to get AI-powered insights, ATS scoring, and
          improvement recommendations.
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("resume-upload").click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {resumeFile ? "Change Resume" : "Upload Resume"}
              </Button>
            </div>
            {resumeFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{resumeFile.name}</span>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: PDF, DOC, DOCX (max 5MB)
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!resumeFile || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>

          {analyzeResume.isError && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to analyze resume. Please try again.</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* ATS Score */}
          <ATSScore
            score={analysisResult.atsAnalysis.score}
            breakdown={analysisResult.atsAnalysis.scoreBreakdown}
          />

          {/* Skills Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Skills Analysis
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Extracted Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Keywords Found
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.atsAnalysis.keywords.found.map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Suggested Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.atsAnalysis.keywords.suggested.map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <ImprovementSuggestions
            improvements={analysisResult.atsAnalysis.improvements}
            suggestions={analysisResult.atsAnalysis.formatting.suggestions}
            issues={analysisResult.atsAnalysis.formatting.issues}
            keywords={analysisResult.atsAnalysis.keywords}
          />

          {/* Confidence Score */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Confidence
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(analysisResult.confidence * 100)}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-purple-600 rounded-full"
                    style={{ width: `${analysisResult.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Job-Specific Analysis */}
          <JobSpecificATS resumeAnalysis={analysisResult} />
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
