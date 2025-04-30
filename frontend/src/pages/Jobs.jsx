import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import JobRecommendations from "../components/JobRecommendations";

export default function Jobs() {
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    jobType: "",
    experience: "",
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/jobs?${params}`);
      return response.data;
    },
  });

  const handleSearch = (searchParams) => {
    setFilters(searchParams);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Next Opportunity
            </h1>
            <Link
              to="/jobs/post"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Post a Job
            </Link>
          </div>

          <SearchBar onSearch={handleSearch} />

          {/* Jobs List */}
          <div className="grid gap-6">
            {jobs?.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                      {job.type}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${job.salary}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>
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
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span>{job.applications} applications</span>
                </div>
              </Link>
            ))}
          </div>

          {jobs?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900">
                No jobs found
              </h3>
              <p className="text-gray-600 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <JobRecommendations />
        </div>
      </div>
    </div>
  );
}
