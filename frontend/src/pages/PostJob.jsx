import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    experience: "",
    salary: "",
    salaryType: "hourly",
    location: "",
    skills: [],
    requirements: [""],
    attachments: [],
  });

  const postJobMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/jobs", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/jobs");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData((prev) => {
      const requirements = [...prev.requirements];
      requirements[index] = value;
      return { ...prev, requirements };
    });
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    setFormData((prev) => {
      const requirements = prev.requirements.filter((_, i) => i !== index);
      return { ...prev, requirements };
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postJobMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post a New Job</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="design">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Salary Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary Type
                </label>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills and Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Skills and Requirements
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Skills
                </label>
                <input
                  type="text"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter skills separated by commas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Add Requirement
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              disabled={postJobMutation.isLoading}
            >
              {postJobMutation.isLoading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
