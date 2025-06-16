import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { jobService } from "../services/jobService";
import SearchBar from "../components/SearchBar";
import JobRecommendations from "../components/JobRecommendations";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { ExternalLink, Database } from "lucide-react";

export default function Jobs() {
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    jobType: "",
    experience: "",
  });
  const [jobSource, setJobSource] = useState("internal"); // "internal" or "external"
  const { user } = useAuth();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", filters, jobSource],
    queryFn: () =>
      jobSource === "external"
        ? jobService.searchExternalJobs(filters)
        : jobService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading jobs
          </h3>
          <p className="text-gray-600">Please try again later</p>
        </div>
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
            {user?.role === "employer" && (
              <Link to="/post-job">
                <Button>Post a Job</Button>
              </Link>
            )}
          </div>

          {/* Job Source Toggle */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Job Source:
            </span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setJobSource("internal")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  jobSource === "internal"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Internal</span>
              </button>
              <button
                onClick={() => setJobSource("external")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  jobSource === "external"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>External</span>
              </button>
            </div>
            {jobSource === "external" && (
              <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                Powered by JSearch API
              </span>
            )}
          </div>

          <SearchBar onSearch={handleSearch} />

          {/* Jobs List */}
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id || job._id || `job-${Math.random()}`}
                className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {jobSource === "internal" && job._id ? (
                  <Link to={`/jobs/${job._id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full capitalize">
                          {job.type.replace("-", " ")}
                        </span>
                        {job.salary && (
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            ${job.salary.min?.toLocaleString()} - $
                            {job.salary.max?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="px-3 py-1 text-sm text-gray-500 bg-gray-50 rounded-full">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{job.experience} level</span>
                    </div>
                  </Link>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.location}
                        </p>
                        {job.source && (
                          <span className="inline-block px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded mt-1">
                            {job.source}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full capitalize">
                          {job.job_type?.replace("-", " ") || "Full Time"}
                        </span>
                        {job.salary && (
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            {job.salary}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-3 py-1 text-sm text-gray-500 bg-gray-50 rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {job.posted_date &&
                          `Posted ${new Date(
                            job.posted_date
                          ).toLocaleDateString()}`}
                      </span>
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {jobs.length === 0 && (
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
