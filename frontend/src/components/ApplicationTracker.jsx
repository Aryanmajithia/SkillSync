import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";

const ApplicationTracker = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/applications");
      return response.data;
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "interview":
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
      case "applied":
        return "Applied";
      case "interview":
        return "Interview";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-20 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">
          No applications yet
        </h3>
        <p className="text-gray-500 mt-2">
          Start applying to jobs to track your progress
        </p>
        <Link
          to="/jobs"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Jobs
        </Link>
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
                  {application.job.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {application.job.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <span className="text-sm font-medium text-gray-700">
                  {getStatusText(application.status)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </div>
            {application.interviewDate && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 mr-1" />
                Interview scheduled for{" "}
                {new Date(application.interviewDate).toLocaleDateString()}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Link
                to={`/applications/${application._id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;
