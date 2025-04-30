import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplicationForm({ jobId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
    portfolio: "",
    expectedSalary: "",
    availability: "",
  });

  const applyMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "resume" && data[key]) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post(`/api/jobs/${jobId}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          name="coverLetter"
          rows="6"
          value={formData.coverLetter}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Explain why you're a good fit for this position..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resume
        </label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          required
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="mt-1 text-sm text-gray-500">
          Accepted formats: PDF, DOC, DOCX
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Portfolio URL
        </label>
        <input
          type="url"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://your-portfolio.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Salary
          </label>
          <input
            type="number"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your expected salary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select availability</option>
            <option value="immediate">Immediate</option>
            <option value="1-week">Within 1 week</option>
            <option value="2-weeks">Within 2 weeks</option>
            <option value="1-month">Within 1 month</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          disabled={applyMutation.isLoading}
        >
          {applyMutation.isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
