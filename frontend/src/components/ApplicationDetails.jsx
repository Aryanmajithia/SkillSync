import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function ApplicationDetails({ application, onStatusUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, feedback }) => {
      const response = await axios.put(`/api/applications/${application._id}`, {
        status,
        feedback,
      });
      return response.data;
    },
    onSuccess: () => {
      onStatusUpdate();
    },
  });

  const handleStatusUpdate = (status) => {
    const feedback = prompt(
      `Please provide feedback for ${
        status === "accepted" ? "accepting" : "rejecting"
      } this application:`
    );
    if (feedback) {
      updateStatusMutation.mutate({ status, feedback });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{application.job.title}</h3>
          <p className="text-gray-600">{application.job.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              application.status === "accepted"
                ? "bg-green-100 text-green-800"
                : application.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {application.status}
          </span>
          {application.status === "pending" && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusUpdate("accepted")}
                className="text-green-600 hover:text-green-900"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="text-red-600 hover:text-red-900"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {application.applicant.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium">{application.applicant.name}</h4>
            <p className="text-sm text-gray-600">
              {application.applicant.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-900"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Cover Letter</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {application.applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Experience</h4>
              <p className="text-gray-600">
                {application.applicant.experience}
              </p>
            </div>

            {application.feedback && (
              <div>
                <h4 className="font-medium mb-2">Feedback</h4>
                <p className="text-gray-600">{application.feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
