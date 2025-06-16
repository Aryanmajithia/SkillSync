import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { aiService } from "../services/aiService";
import { useAuth } from "../hooks/useAuth";
import { Briefcase, Star, MapPin, DollarSign } from "lucide-react";

const AIJobMatcher = () => {
  const { user } = useAuth();

  const {
    data: matchedJobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["aiJobMatches", user?.id],
    queryFn: async () => {
      try {
        const result = await aiService.getJobRecommendations(user?.id);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Error fetching AI job matches:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI-Powered Job Matches
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
          AI-Powered Job Matches
        </h2>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Unable to load job matches</p>
          <p className="text-gray-400 text-xs mt-1">
            Try refreshing the page or check your connection
          </p>
        </div>
      </div>
    );
  }

  if (!matchedJobs.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI-Powered Job Matches
        </h2>
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No job matches found
          </h3>
          <p className="mt-2 text-gray-500">
            Complete your profile to get better job recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        AI-Powered Job Matches
      </h2>
      <p className="text-gray-600 mb-6">
        Jobs that match your skills and experience
      </p>

      <div className="space-y-4">
        {matchedJobs.map((job) => (
          <div
            key={job._id || `ai-job-${Math.random()}`}
            className="block p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
          >
            {job._id ? (
              <Link to={`/jobs/${job._id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {job.title || "Job Title"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.company || "Company"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {job.matchScore || 0}% Match
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location || "Location"}
                  </div>
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />$
                      {job.salary.min?.toLocaleString() || 0} - $
                      {job.salary.max?.toLocaleString() || 0}
                    </div>
                  )}
                </div>

                {job.matchingSkills && job.matchingSkills.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Matching Skills:
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {job.matchingSkills.map((skill, index) => (
                        <span
                          key={`match-${skill}-${index}`}
                          className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.skillGaps && job.skillGaps.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Skills to Develop:
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {job.skillGaps.map((skill, index) => (
                        <span
                          key={`gap-${skill}-${index}`}
                          className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {job.title || "Job Title"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.company || "Company"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {job.matchScore || 0}% Match
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIJobMatcher;
