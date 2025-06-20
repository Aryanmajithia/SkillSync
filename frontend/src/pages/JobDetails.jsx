import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "../services/jobService";
import { MapPin, DollarSign, Clock, Building, Briefcase } from "lucide-react";
import JobApplicationForm from "../components/JobApplicationForm";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    // Try to fetch real job first
    jobService
      .getJob(id)
      .then((data) => {
        if (isMounted) {
          setJob(data);
          setIsLoading(false);
        }
      })
      .catch(async () => {
        // If not found, try to fetch from mock jobs
        try {
          const mockJobs = await jobService.getJobs();
          const found = mockJobs.find((j) => String(j.id) === String(id));
          if (isMounted) {
            setJob(found || null);
            setIsLoading(false);
          }
        } catch (e) {
          if (isMounted) {
            setError(e);
            setIsLoading(false);
          }
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/jobs")} className="mt-4">
          Browse Jobs
        </Button>
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
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full capitalize">
                {job.type.replace("-", " ")}
              </span>
              {job.salary && (
                <p className="text-xl font-bold text-gray-900 mt-2">
                  ${job.salary.min?.toLocaleString()} - $
                  {job.salary.max?.toLocaleString()}
                </p>
              )}
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
              <span className="capitalize">{job.experience} level</span>
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

          {job.requirements && job.requirements.length > 0 && (
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
          )}

          {job.skills && job.skills.length > 0 && (
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
          )}

          <div className="mt-8 border-t pt-8">
            {!user ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please log in to apply for this job
                </p>
                <Button onClick={() => navigate("/login")}>
                  Login to Apply
                </Button>
              </div>
            ) : user.role === "employer" ? (
              <div className="text-center">
                <p className="text-gray-600">Employers cannot apply for jobs</p>
              </div>
            ) : showApplicationForm ? (
              <JobApplicationForm jobId={job._id || job.id} />
            ) : (
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="w-full"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
