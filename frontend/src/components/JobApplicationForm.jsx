import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../services/applicationService";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Upload, X, Server } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const JobApplicationForm = ({ jobId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
    portfolio: "",
    availability: "",
    expectedSalary: "",
  });

  // Server health check function
  const checkServerHealth = async () => {
    try {
      console.log("Checking server health...");
      const health = await applicationService.checkServerHealth();
      console.log("Server health:", health);
      toast.success("Server is running and healthy!");
    } catch (error) {
      console.error("Server health check failed:", error);
      toast.error("Server is not responding. Please start the backend server.");
    }
  };

  const applyForJob = useMutation({
    mutationFn: async (data) => {
      console.log("Starting application submission...");
      console.log("JobId:", jobId);
      console.log("Form data:", data);

      const formDataToSend = new FormData();

      // Append all form data, including empty strings
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === "resume" && data[key] instanceof File) {
            // Handle file upload properly
            formDataToSend.append(key, data[key], data[key].name);
            console.log("Added resume file:", data[key].name);
          } else {
            formDataToSend.append(key, data[key]);
          }
        }
      });

      // Always append jobId
      formDataToSend.append("jobId", jobId);

      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, "File:", value.name, value.size, value.type);
        } else {
          console.log(key, value);
        }
      }

      console.log("Calling applicationService.submitApplication...");
      const result = await applicationService.submitApplication(formDataToSend);
      console.log("Application submission result:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      queryClient.invalidateQueries(["myApplications"]);
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);

    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Resume file size should be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a PDF, DOC, or DOCX file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));

      toast.success(`Resume uploaded: ${file.name}`);
    } else {
      console.log("No file selected");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form data before validation:", formData);
    console.log("User:", user);
    console.log("Authentication token:", localStorage.getItem("token"));

    // Check if user is authenticated
    if (!user) {
      toast.error("Please log in to submit an application");
      navigate("/login");
      return;
    }

    if (!formData.coverLetter.trim()) {
      toast.error("Please provide a cover letter");
      return;
    }

    if (!formData.availability.trim()) {
      toast.error("Please provide your availability");
      return;
    }

    if (!formData.expectedSalary) {
      toast.error("Please provide your expected salary");
      return;
    }

    // Check if resume is uploaded (optional but good to validate)
    if (formData.resume) {
      console.log("Resume file details:", {
        name: formData.resume.name,
        size: formData.resume.size,
        type: formData.resume.type,
      });
    } else {
      console.log("No resume file uploaded");
    }

    console.log("Form data after validation:", formData);
    applyForJob.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="coverLetter">Cover Letter *</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          rows={6}
          placeholder="Explain why you're a good fit for this position..."
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="resume">Resume</Label>
        <div className="mt-1 flex items-center gap-4">
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("resume").click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          {formData.resume && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{formData.resume.name}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, resume: null }))
                }
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Accepted formats: PDF, DOC, DOCX (max 5MB)
        </p>
      </div>

      <div>
        <Label htmlFor="portfolio">Portfolio URL</Label>
        <Input
          id="portfolio"
          name="portfolio"
          type="url"
          value={formData.portfolio}
          onChange={handleInputChange}
          placeholder="https://your-portfolio.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="availability">Availability *</Label>
        <Input
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleInputChange}
          placeholder="e.g., Immediately, 2 weeks notice, etc."
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="expectedSalary">Expected Salary *</Label>
        <Input
          id="expectedSalary"
          name="expectedSalary"
          type="number"
          value={formData.expectedSalary}
          onChange={handleInputChange}
          placeholder="Enter your expected salary"
          required
          className="mt-1"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={checkServerHealth}
          className="flex items-center gap-2"
        >
          <Server className="w-4 h-4" />
          Test Server
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={applyForJob.isLoading}>
          {applyForJob.isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default JobApplicationForm;
