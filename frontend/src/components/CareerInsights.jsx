import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  getJobRecommendations,
  getMarketInsights,
  getSalaryInsights,
  getSkillDevelopmentRecommendations,
  getCareerPathSuggestions,
  getApplicationStrategy,
  getNegotiationTips,
  getInterviewPreparation,
  getNetworkingSuggestions,
  getApplicationOptimization,
  analyzeSkillGap,
  predictJobSatisfaction,
  researchCompany,
  getMarketTrends,
  getSkillDemand,
} from "../services/aiService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const CareerInsights = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    recommendations: [],
    marketInsights: {},
    salaryInsights: {},
    skillGap: {},
    careerPath: {},
    applicationStrategy: {},
    interviewPrep: {},
    networking: {},
    optimization: {},
    satisfaction: {},
    companyResearch: {},
    marketTrends: {},
    skillDemand: {},
  });

  useEffect(() => {
    if (user) {
      loadInsightsData();
    }
  }, [user]);

  const loadInsightsData = async () => {
    setLoading(true);
    try {
      // Check if user and user.id exist
      if (!user || !user.id) {
        console.error("User or user ID not available");
        toast.error("Please log in to view career insights");
        return;
      }

      // Load all career insights in parallel
      const [
        recommendations,
        marketInsights,
        salaryInsights,
        skillGap,
        careerPath,
        applicationStrategy,
        interviewPrep,
        networking,
        optimization,
        satisfaction,
        companyResearch,
        marketTrends,
        skillDemand,
      ] = await Promise.allSettled([
        getJobRecommendations(user.id),
        getMarketInsights("technology", user.location),
        getSalaryInsights(user.title, user.location, user.experience),
        analyzeSkillGap(user.skills || [], []),
        getCareerPathSuggestions(user),
        getApplicationStrategy(user, []),
        getInterviewPreparation({}, user),
        getNetworkingSuggestions(user, "technology"),
        getApplicationOptimization({}),
        predictJobSatisfaction({}, user),
        researchCompany("TechCorp"),
        getMarketTrends("technology", user.location),
        getSkillDemand("technology", user.location),
      ]);

      setData({
        recommendations:
          recommendations.status === "fulfilled" ? recommendations.value : [],
        marketInsights:
          marketInsights.status === "fulfilled" ? marketInsights.value : {},
        salaryInsights:
          salaryInsights.status === "fulfilled" ? salaryInsights.value : {},
        skillGap: skillGap.status === "fulfilled" ? skillGap.value : {},
        careerPath: careerPath.status === "fulfilled" ? careerPath.value : {},
        applicationStrategy:
          applicationStrategy.status === "fulfilled"
            ? applicationStrategy.value
            : {},
        interviewPrep:
          interviewPrep.status === "fulfilled" ? interviewPrep.value : {},
        networking: networking.status === "fulfilled" ? networking.value : {},
        optimization:
          optimization.status === "fulfilled" ? optimization.value : {},
        satisfaction:
          satisfaction.status === "fulfilled" ? satisfaction.value : {},
        companyResearch:
          companyResearch.status === "fulfilled" ? companyResearch.value : {},
        marketTrends:
          marketTrends.status === "fulfilled" ? marketTrends.value : {},
        skillDemand:
          skillDemand.status === "fulfilled" ? skillDemand.value : {},
      });

      toast.success("Career insights loaded successfully!");
    } catch (error) {
      console.error("Error loading career insights:", error);
      toast.error("Failed to load some career insights");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Career Overview", icon: "📊" },
    { id: "recommendations", label: "Smart Job Matches", icon: "🎯" },
    { id: "market", label: "Market Intelligence", icon: "📈" },
    { id: "skills", label: "Skill Analysis", icon: "⚡" },
    { id: "career", label: "Career Roadmap", icon: "🚀" },
    { id: "applications", label: "Application Strategy", icon: "📝" },
    { id: "interview", label: "Interview Preparation", icon: "🎤" },
    { id: "networking", label: "Networking Guide", icon: "🤝" },
    { id: "optimization", label: "Profile Optimization", icon: "🔧" },
  ];

  // Fallback/mock data for each section
  const fallbackData = {
    marketTrends: {
      jobMarketTrends: {
        growing: ["AI Engineer", "Data Scientist", "DevOps Engineer"],
        declining: ["COBOL Developer", "Manual QA Tester"],
      },
      salaryTrends: "Salaries increasing 5-10% annually",
      inDemandSkills: ["Python", "React", "AWS", "Machine Learning"],
      remoteWorkTrends: "Hybrid work becoming standard",
      industryChallenges: [
        "Talent shortage",
        "Skill gaps",
        "Remote collaboration",
      ],
      futurePredictions: "Continued growth in tech sector",
      jobSeekerRecommendations: [
        "Upskill in emerging technologies",
        "Build remote work skills",
        "Focus on soft skills",
      ],
      employerRecommendations: [
        "Offer competitive benefits",
        "Embrace remote work",
        "Invest in employee development",
      ],
    },
    skillGap: {
      missingSkills: ["TypeScript", "GraphQL", "Docker"],
    },
    skillDemand: {
      technicalSkills: [
        { skill: "Python", demand: "Very High", salary: "$120k" },
        { skill: "React", demand: "High", salary: "$110k" },
        { skill: "AWS", demand: "High", salary: "$130k" },
      ],
      learningResources: {
        Python: ["Coursera Python", "edX Python Basics"],
        React: ["React Docs", "Frontend Masters React"],
      },
      certifications: [
        "AWS Certified Developer",
        "Google Data Engineer",
        "Microsoft Azure Developer",
      ],
    },
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Career Intelligence Dashboard
        </h2>
        <p className="text-gray-600">
          AI-powered insights to accelerate your career growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Job Match Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data.recommendations.length > 0
                ? Math.round(data.recommendations[0]?.matchScore || 85)
                : 85}
              %
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on your profile and current market
            </p>
            <Progress
              value={
                data.recommendations.length > 0
                  ? Math.round(data.recommendations[0]?.matchScore || 85)
                  : 85
              }
              className="mt-3"
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Salary Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.salaryInsights?.averageSalary || "$80K - $120K"}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              For your experience level
            </p>
            <div className="mt-3 text-xs text-gray-500">
              {data.salaryInsights?.salaryByExperience?.mid || "Market average"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Market Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.marketTrends?.salaryTrends || "Growing"}
            </div>
            <p className="text-sm text-gray-600 mt-2">Industry outlook</p>
            <div className="mt-3 text-xs text-gray-500">
              {data.marketTrends?.jobMarketTrends?.growing?.length || 0} growing
              roles
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Skill Gap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.skillGap?.missingSkills?.length || 3} skills
            </div>
            <p className="text-sm text-gray-600 mt-2">
              To develop for better opportunities
            </p>
            <div className="mt-3">
              {data.skillGap?.missingSkills?.slice(0, 2).map((skill, i) => (
                <Badge key={i} variant="outline" className="mr-1 text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Career Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {data.careerPath?.nextSteps?.length || 5} steps
            </div>
            <p className="text-sm text-gray-600 mt-2">To advance your career</p>
            <div className="mt-3 text-xs text-gray-500">
              Next: {data.careerPath?.nextSteps?.[0] || "Skill development"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {data.applicationStrategy?.targetJobs?.length || 10} jobs
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Recommended to apply for
            </p>
            <div className="mt-3 text-xs text-gray-500">
              {data.recommendations.length} matches found
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJobRecommendations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            AI-Powered Job Recommendations
          </h3>
          <p className="text-gray-600">
            Personalized job matches based on your skills and preferences
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {data.recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.recommendations.slice(0, 6).map((job, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <Badge
                    variant={job.matchScore > 90 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {job.matchScore}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">📍 Location:</span>
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">💰 Salary:</span>
                    <span className="text-sm">
                      ${job.salary?.min?.toLocaleString()} - $
                      {job.salary?.max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">🛠️ Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {job.skills?.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {job.reasoning && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <strong>🤖 AI Insight:</strong> {job.reasoning}
                    </div>
                  )}
                  {job.skillMatch > 0 && (
                    <div className="text-sm text-green-600">
                      ✅ {job.skillMatch} skills match your profile
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No job matches found</h3>
          <p className="text-gray-600 mb-4">
            Complete your profile with skills and experience to get personalized
            recommendations
          </p>
          <Button onClick={loadInsightsData} disabled={loading}>
            {loading ? "Loading..." : "Try Again"}
          </Button>
        </Card>
      )}
    </div>
  );

  const renderMarketInsights = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Market Intelligence</h3>
          <p className="text-gray-600">
            Real-time insights into job market trends and opportunities
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Job Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.marketTrends?.jobMarketTrends ||
            fallbackData.marketTrends.jobMarketTrends ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">
                    Growing Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(
                      data.marketTrends?.jobMarketTrends?.growing ||
                      fallbackData.marketTrends.jobMarketTrends.growing
                    ).map((role, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-green-700 bg-green-50"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">
                    Declining Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(
                      data.marketTrends?.jobMarketTrends?.declining ||
                      fallbackData.marketTrends.jobMarketTrends.declining
                    ).map((role, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-red-700 bg-red-50"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Market trends data not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Salary Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.salaryInsights ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Average Salary Range</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.salaryInsights.averageSalary || "$80K - $120K"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">By Experience Level</h4>
                  <div className="space-y-2">
                    {data.salaryInsights.salaryByExperience &&
                      Object.entries(
                        data.salaryInsights.salaryByExperience
                      ).map(([level, salary]) => (
                        <div key={level} className="flex justify-between">
                          <span className="capitalize">{level}:</span>
                          <span className="font-medium">{salary}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Salary data not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛠️ In-Demand Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.marketTrends?.inDemandSkills ? (
              <div className="flex flex-wrap gap-2">
                {data.marketTrends.inDemandSkills.map((skill, i) => (
                  <Badge key={i} variant="default">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Skills data not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏠 Remote Work Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {data.marketTrends?.remoteWorkTrends ||
                "Hybrid work becoming standard"}
            </p>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.marketTrends?.jobSeekerRecommendations?.map((rec, i) => (
                  <li key={i}>• {rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSkillAnalysis = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Skill Analysis</h3>
          <p className="text-gray-600">
            Identify skill gaps and development opportunities
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Skill Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.skillGap?.missingSkills ? (
              <div className="space-y-3">
                {data.skillGap.missingSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <span className="font-medium text-red-700">{skill}</span>
                    <Badge variant="destructive">Missing</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skill gaps identified</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.skillDemand?.learningResources ? (
              <div className="space-y-3">
                {Object.entries(data.skillDemand.learningResources).map(
                  ([skill, resources]) => (
                    <div key={skill} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">
                        {skill}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {resources.map((resource, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500">Learning resources not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.skillDemand?.certifications ? (
              <div className="space-y-2">
                {data.skillDemand.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center p-2 bg-green-50 rounded"
                  >
                    <span className="text-green-700">🏆</span>
                    <span className="ml-2 text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Certification recommendations not available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Skill Demand Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.skillDemand?.technicalSkills ? (
              <div className="space-y-3">
                {data.skillDemand.technicalSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{skill.skill}</span>
                    <div className="text-right">
                      <Badge
                        variant={
                          skill.demand === "Very High" ? "default" : "secondary"
                        }
                      >
                        {skill.demand}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {skill.salary}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Skill demand data not available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCareerPath = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Career Roadmap</h3>
          <p className="text-gray-600">
            Your personalized path to career advancement
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {Array.isArray(data.careerPath) && data.careerPath.length > 0 ? (
        <div className="space-y-6">
          {data.careerPath.map((step, index) => (
            <Card key={index} className="relative">
              <div className="absolute left-4 top-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <CardHeader className="pl-16">
                <CardTitle className="text-lg">
                  {step.level || step.title || `Step ${index + 1}`}
                </CardTitle>
                <p className="text-gray-600">
                  Timeline: {step.timeline || "-"}
                </p>
              </CardHeader>
              <CardContent className="pl-16">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(step.skills)
                        ? step.skills.map((skill, i) => (
                            <Badge key={i} variant="outline">
                              {skill}
                            </Badge>
                          ))
                        : null}
                    </div>
                  </div>
                  {Array.isArray(step.recommendations) && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {step.recommendations.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(step.steps) && (
                    <div>
                      <h4 className="font-medium mb-2">Steps</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {step.steps.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">
            Career path not available
          </h3>
          <p className="text-gray-600">
            Complete your profile to get personalized career guidance
          </p>
        </Card>
      )}
    </div>
  );

  const renderApplicationStrategy = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Application Strategy</h3>
          <p className="text-gray-600">
            Optimize your job search and application process
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {data.applicationStrategy ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Target Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.applicationStrategy.targetJobs ? (
                <div className="space-y-2">
                  {data.applicationStrategy.targetJobs.map((job, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Target jobs not specified</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Application Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.applicationStrategy.tips ? (
                <ul className="space-y-2">
                  {data.applicationStrategy.tips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Application tips not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">
            Application strategy not available
          </h3>
          <p className="text-gray-600">
            Complete your profile to get personalized application guidance
          </p>
        </Card>
      )}
    </div>
  );

  const renderInterviewPrep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Interview Preparation</h3>
          <p className="text-gray-600">
            Get ready for your next interview with AI-powered guidance
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {data.interviewPrep ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ❓ Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.interviewPrep.questions ? (
                <div className="space-y-3">
                  {data.interviewPrep.questions.map((question, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">{question}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Interview questions not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 Preparation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.interviewPrep.tips ? (
                <ul className="space-y-2">
                  {data.interviewPrep.tips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Preparation tips not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-semibold mb-2">
            Interview preparation not available
          </h3>
          <p className="text-gray-600">
            Complete your profile to get personalized interview guidance
          </p>
        </Card>
      )}
    </div>
  );

  const renderNetworking = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Networking Guide</h3>
          <p className="text-gray-600">
            Build your professional network strategically
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {data.networking ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤝 Networking Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.networking.strategies ? (
                <ul className="space-y-2">
                  {data.networking.strategies.map((strategy, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-sm">{strategy}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  Networking strategies not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📍 Events & Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.networking.platforms ? (
                <div className="space-y-2">
                  {data.networking.platforms.map((platform, i) => (
                    <div key={i} className="p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">{platform}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Networking platforms not available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">
            Networking guide not available
          </h3>
          <p className="text-gray-600">
            Complete your profile to get personalized networking guidance
          </p>
        </Card>
      )}
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Profile Optimization</h3>
          <p className="text-gray-600">
            Optimize your profile for better job matches
          </p>
        </div>
        <Button onClick={loadInsightsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {data.optimization ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.optimization.suggestions ? (
                <ul className="space-y-2">
                  {data.optimization.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2">🔧</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  Optimization suggestions not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Profile Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.optimization.score ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {data.optimization.score}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Profile completeness
                    </p>
                  </div>
                  <Progress
                    value={data.optimization.score}
                    className="w-full"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Profile score not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold mb-2">
            Profile optimization not available
          </h3>
          <p className="text-gray-600">
            Complete your profile to get optimization suggestions
          </p>
        </Card>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "recommendations":
        return renderJobRecommendations();
      case "market":
        return renderMarketInsights();
      case "skills":
        return renderSkillAnalysis();
      case "career":
        return renderCareerPath();
      case "applications":
        return renderApplicationStrategy();
      case "interview":
        return renderInterviewPrep();
      case "networking":
        return renderNetworking();
      case "optimization":
        return renderOptimization();
      default:
        return renderOverview();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your personalized career insights
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Career Insights Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user.name}! Here's your personalized career
          intelligence.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <span>{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Loading your career insights...</p>
        </Card>
      )}

      {/* Content */}
      {!loading && renderTabContent()}
    </div>
  );
};

export default CareerInsights;
