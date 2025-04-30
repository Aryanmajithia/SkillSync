import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiService } from "../services/aiService";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const ResumeAnalyzer = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = useMutation({
    mutationFn: async (file) => {
      const result = await aiService.analyzeResume(file);
      return result;
    },
    onSuccess: (data) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        AI Resume Analyzer
      </h2>
      <p className="text-gray-600 mb-6">
        Upload your resume to get AI-powered insights and skill recommendations.
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
  );
};

export default ResumeAnalyzer;
