import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, DollarSign, Clock, Building, Briefcase } from "lucide-react";
import JobApplicationForm from "../components/JobApplicationForm";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`/api/jobs/${id}`);
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

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-lg text-gray-600 mt-1">{job.company}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                {job.type}
              </span>
              <p className="text-xl font-bold text-gray-900 mt-2">
                ${job.salary}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building className="w-5 h-5 mr-2" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-5 h-5 mr-2" />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Job Description
            </h2>
            <div className="mt-4 prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Requirements
            </h2>
            <ul className="mt-4 list-disc list-inside text-gray-700">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            {showApplicationForm ? (
              <JobApplicationForm jobId={job._id} />
            ) : (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
