import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { applicationService } from "../services/applicationService";
import {
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";

const ApplicationTracker = () => {
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => applicationService.getMyApplications(),
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "shortlisted":
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "shortlisted":
        return "Shortlisted";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Application Tracker
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Application Tracker
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Error loading applications</p>
        </div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Application Tracker
        </h2>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500 mt-2">
            Start applying to jobs to track your progress
          </p>
          <Link to="/jobs" className="mt-4 inline-block">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Application Tracker
      </h2>
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application._id}
            className="p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {application.job?.title || "Job Title"}
                </h3>
                <p className="text-sm text-gray-600">
                  {application.job?.company || "Company"}
                </p>
                <p className="text-sm text-gray-500">
                  {application.job?.location || "Location"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(
                    application.status
                  )}`}
                >
                  {getStatusText(application.status)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </div>
            {application.expectedSalary && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>
                  Expected Salary: $
                  {application.expectedSalary?.toLocaleString()}
                </span>
              </div>
            )}
            {application.availability && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Availability: {application.availability}</span>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Link
                to={`/jobs/${application.job?._id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Job Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;
