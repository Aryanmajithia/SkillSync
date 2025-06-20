import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "../services/jobService";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { applicationService } from "../services/applicationService";

const MyPostedJobs = () => {
  const { user } = useAuth();
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});

  const {
    data: jobs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myPostedJobs"],
    queryFn: () => jobService.getMyPostedJobs(),
    enabled: !!user && user.role === "employer",
  });

  const fetchApplications = async (jobId) => {
    setLoadingApps((prev) => ({ ...prev, [jobId]: true }));
    try {
      const apps = await applicationService.getJobApplications(jobId);
      setApplicationsByJob((prev) => ({ ...prev, [jobId]: apps }));
    } catch (e) {
      toast.error("Failed to load applications");
    } finally {
      setLoadingApps((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleToggleApplications = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      if (!applicationsByJob[jobId]) {
        fetchApplications(jobId);
      }
    }
  };

  const handleStatusChange = async (applicationId, jobId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );
      toast.success("Status updated");
      fetchApplications(jobId);
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobService.deleteJob(jobId);
        toast.success("Job deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (!user || user.role !== "employer") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Only employers can view posted jobs.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Posted Jobs
        </h2>
        <Link to="/post-job">
          <Button>Post New Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start posting jobs to find great candidates for your company.
          </p>
          <Link to="/post-job">
            <Button>Post Your First Job</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {job.company}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary?.min && job.salary?.max
                        ? `$${job.salary.min}k - $${job.salary.max}k`
                        : "Salary not specified"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.posted_date
                        ? new Date(job.posted_date).toLocaleDateString()
                        : "Recently posted"}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <Link to={`/jobs/${job._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/edit-job/${job._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleApplications(job._id)}
                    className="mt-2"
                  >
                    {expandedJobId === job._id ? (
                      <ChevronUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    )}
                    {expandedJobId === job._id
                      ? "Hide Applications"
                      : "View Applications"}
                  </Button>
                </div>
              </div>
              {/* Applications Section */}
              {expandedJobId === job._id && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  {loadingApps[job._id] ? (
                    <div>Loading applications...</div>
                  ) : applicationsByJob[job._id] &&
                    applicationsByJob[job._id].length > 0 ? (
                    <div className="space-y-4">
                      {applicationsByJob[job._id].map((app) => (
                        <div
                          key={app._id}
                          className="p-3 rounded border flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {app.applicantName ||
                                app.user?.name ||
                                "Applicant"}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {app.user?.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              Status:{" "}
                              <span className="font-semibold">
                                {app.status}
                              </span>
                            </div>
                            {app.coverLetter && (
                              <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">
                                  Cover Letter:
                                </span>{" "}
                                {app.coverLetter}
                              </div>
                            )}
                            {app.expectedSalary && (
                              <div className="text-xs text-gray-500">
                                Expected Salary: ${app.expectedSalary}
                              </div>
                            )}
                            {app.availability && (
                              <div className="text-xs text-gray-500">
                                Availability: {app.availability}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center gap-2">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  app._id,
                                  job._id,
                                  e.target.value
                                )
                              }
                              disabled={updatingStatus[app._id]}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            {updatingStatus[app._id] && (
                              <span className="text-xs text-gray-400 ml-2">
                                Updating...
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No applications yet.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;
