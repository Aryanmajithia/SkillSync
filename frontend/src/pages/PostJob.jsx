import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { jobService } from "../services/jobService";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    experience: "entry",
    salary: {
      min: "",
      max: "",
    },
    description: "",
    requirements: "",
    skills: "",
  });

  const postJobMutation = useMutation({
    mutationFn: (data) => {
      console.log("Calling jobService.createJob with data:", data);
      return jobService.createJob(data);
    },
    onSuccess: (data) => {
      console.log("Job posted successfully:", data);
      toast.success("Job posted successfully!");
      navigate("/jobs");
    },
    onError: (error) => {
      console.error("Job posting error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post job. Please try again."
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        salary: {
          ...prev.salary,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleExperienceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      experience: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare data for submission
    const jobData = {
      ...formData,
      requirements: formData.requirements
        .split("\n")
        .filter((line) => line.trim()),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      salary: {
        min: parseInt(formData.salary.min) || 0,
        max: parseInt(formData.salary.max) || 0,
      },
    };

    console.log("Submitting job data:", jobData);
    postJobMutation.mutate(jobData);
  };

  // Redirect if user is not an employer
  if (user?.role !== "employer") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Only employers can post jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post a New Job</h1>
        <Button onClick={() => navigate("/jobs")} variant="outline">
          Back to Jobs
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Job Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="e.g., Senior React Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Your company name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="e.g., New York, NY or Remote"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Experience and Salary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Experience & Compensation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experience}
                  onValueChange={handleExperienceChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salaryMin">Min Salary ($)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Max Salary ($)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="mt-1"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                rows="4"
                value={formData.requirements}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter requirements, one per line..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter each requirement on a new line
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="mt-1"
                placeholder="React, Node.js, MongoDB, TypeScript"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter skills separated by commas
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={postJobMutation.isLoading}>
              {postJobMutation.isLoading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
