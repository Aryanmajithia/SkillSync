import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { jobService } from "../services/jobService";
import { useAuth } from "../hooks/useAuth";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

const JobRecommendations = () => {
  const { user } = useAuth();

  const {
    data: recommendations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobRecommendations", user?.id],
    queryFn: () => jobService.getRecommendations(user?.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended for You
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended for You
        </h2>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Unable to load recommendations
          </p>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended for You
        </h2>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No recommendations available</p>
          <p className="text-gray-400 text-xs mt-1">
            Update your profile to get personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recommended for You
      </h2>
      <div className="space-y-4">
        {recommendations.map((job) => (
          <div
            key={job._id || `job-${Math.random()}`}
            className="block p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
          >
            {job._id ? (
              <Link to={`/jobs/${job._id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  {job.matchScore && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      {job.matchScore}% Match
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />$
                      {job.salary.min?.toLocaleString()} - $
                      {job.salary.max?.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="capitalize">
                      {job.type?.replace("-", " ") || "Full Time"}
                    </span>
                  </div>
                </div>
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span
                        key="more-skills"
                        className="px-2 py-1 text-xs text-gray-500"
                      >
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                {job.matchScore && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {job.matchScore}% Match
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
