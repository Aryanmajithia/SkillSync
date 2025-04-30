import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

const JobApplicationForm = ({ jobId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
    portfolio: "",
    availability: "",
    expectedSalary: "",
  });

  const applyForJob = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append("jobId", jobId);

      const response = await axios.post("/api/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      toast.success("Application submitted successfully!");
      navigate("/applications");
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
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Resume file size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyForJob.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
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
        <Label htmlFor="availability">Availability</Label>
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
        <Label htmlFor="expectedSalary">Expected Salary</Label>
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
