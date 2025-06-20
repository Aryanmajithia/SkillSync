import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCandidateRanking } from "../services/aiService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  User,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";

const CandidateRanking = () => {
  const { jobId } = useParams();
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (jobId) {
      loadCandidateRanking();
    }
  }, [jobId]);

  const loadCandidateRanking = async () => {
    try {
      setLoading(true);
      const data = await getCandidateRanking(jobId);
      setRanking(data);
    } catch (error) {
      console.error("Error loading candidate ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ranking) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No candidates found
        </h3>
        <p className="text-gray-600">
          No applications have been received for this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI Candidate Ranking
          </h2>
          <p className="text-gray-600 mt-1">
            {ranking.job.title} at {ranking.job.company}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {ranking.totalCandidates} candidates ranked by AI
          </p>
        </div>
        <Button onClick={loadCandidateRanking} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Job Requirements Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {ranking.job.requirements.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Experience Level</h4>
              <p className="text-gray-600">{ranking.job.experience}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Rankings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ranked Candidates</h3>
        {ranking.candidates.map((candidate, index) => (
          <Card
            key={candidate.application._id}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              selectedCandidate?._id === candidate.application._id
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <Avatar>
                      <AvatarImage src={candidate.candidate.avatar} />
                      <AvatarFallback>
                        {candidate.candidate.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {candidate.candidate.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {candidate.candidate.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${getMatchColor(
                      candidate.matchScore
                    )} font-semibold`}
                  >
                    {candidate.matchScore}% Match
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {getMatchLabel(candidate.matchScore)}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Match Score Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Match Score</span>
                    <span>{candidate.matchScore}%</span>
                  </div>
                  <Progress value={candidate.matchScore} className="h-2" />
                </div>

                {/* Skill Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Strengths ({candidate.strengths.length})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {candidate.strengths.slice(0, 5).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs text-green-700 bg-green-50"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.strengths.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.strengths.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center">
                      <XCircle className="h-4 w-4 mr-1 text-red-600" />
                      Missing Skills ({candidate.weaknesses.length})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {candidate.weaknesses.slice(0, 5).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs text-red-700 bg-red-50"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.weaknesses.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.weaknesses.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium">
                      {candidate.candidate.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Experience:</span>
                    <p className="font-medium">
                      {candidate.candidate.experience || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Resume Score:</span>
                    <p className="font-medium">
                      {candidate.resumeScore
                        ? `${candidate.resumeScore}%`
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Applied:</span>
                    <p className="font-medium">
                      {new Date(
                        candidate.application.appliedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to application details
                    }}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Start chat with candidate
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Schedule interview
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Candidate View Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Candidate Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCandidate.candidate.avatar} />
                  <AvatarFallback>
                    {selectedCandidate.candidate.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedCandidate.candidate.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCandidate.candidate.email}
                  </p>
                  <Badge
                    className={`${getMatchColor(
                      selectedCandidate.matchScore
                    )} mt-2`}
                  >
                    {selectedCandidate.matchScore}% Match
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Skills Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2 text-green-700">
                        Matched Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.strengths.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-green-700 bg-green-50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2 text-red-700">
                        Missing Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.weaknesses.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-red-700 bg-red-50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Profile Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">
                        {selectedCandidate.candidate.location ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <p className="font-medium">
                        {selectedCandidate.candidate.experience ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Salary Expectations:
                      </span>
                      <p className="font-medium">
                        {selectedCandidate.candidate.salaryExpectations
                          ? `$${selectedCandidate.candidate.salaryExpectations}`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Resume Score:</span>
                      <p className="font-medium">
                        {selectedCandidate.resumeScore
                          ? `${selectedCandidate.resumeScore}%`
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">View Full Application</Button>
                  <Button variant="outline">Schedule Interview</Button>
                  <Button variant="outline">Send Message</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRanking;
