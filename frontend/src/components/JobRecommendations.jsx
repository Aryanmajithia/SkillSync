import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

const JobRecommendations = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["jobRecommendations"],
    queryFn: async () => {
      const response = await axios.get("/api/jobs/recommendations");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!recommendations?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recommended for You
      </h2>
      <div className="space-y-4">
        {recommendations.map((job) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className="block p-4 rounded-lg border border-gray-100 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                {job.matchScore}% Match
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {job.type}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
