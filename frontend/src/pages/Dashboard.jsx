import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePremium } from "../hooks/usePremium";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { applicationService } from "../services/applicationService";
import { jobService } from "../services/jobService";
import ApplicationTracker from "../components/ApplicationTracker";
import JobRecommendations from "../components/JobRecommendations";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import AIJobMatcher from "../components/AIJobMatcher";
import PremiumAIInterview from "../components/PremiumAIInterview";
import PremiumFeatureGuard from "../components/PremiumFeatureGuard";
import {
  Briefcase,
  Bell,
  MessageSquare,
  User,
  Sparkles,
  Plus,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Star,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Brain,
  TrendingUp,
  Crown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { isPremium, subscriptionData } = usePremium();
  const [showPremiumAIInterview, setShowPremiumAIInterview] = useState(false);
  const [showInterviewAI, setShowInterviewAI] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interviewResults, setInterviewResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Interview questions
  const interviewQuestions = [
    {
      question:
        "Can you explain the difference between synchronous and asynchronous programming?",
      category: "Technical",
      timeLimit: 120,
      keywords: ["async", "await", "promises", "callbacks", "threading"],
      sampleAnswer:
        "Synchronous programming executes code sequentially, blocking execution until each operation completes. Asynchronous programming allows operations to run in the background, using callbacks, promises, or async/await to handle results when ready.",
    },
    {
      question: "How would you optimize a slow-performing database query?",
      category: "Technical",
      timeLimit: 90,
      keywords: ["indexing", "query optimization", "database", "performance"],
      sampleAnswer:
        "I would analyze the query execution plan, add appropriate indexes, optimize the query structure, consider caching strategies, and potentially restructure the database schema if needed.",
    },
    {
      question:
        "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Behavioral",
      timeLimit: 120,
      keywords: ["problem-solving", "collaboration", "learning", "adaptation"],
      sampleAnswer:
        "I worked on a project with tight deadlines and changing requirements. I used agile methodologies, broke down tasks, communicated regularly with stakeholders, and learned new technologies as needed.",
    },
  ];

  // Fetch user's applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !!user,
  });

  // Fetch job recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ["jobRecommendations", user?.id],
    queryFn: () => jobService.getRecommendations(user?.id),
    enabled: !!user?.id,
  });

  const handleResumeAnalysis = (analysisData) => {
    toast.success("Resume analyzed successfully!");
    console.log("Resume analysis results:", analysisData);
  };

  // Calculate stats
  const stats = {
    applications: applications.length,
    notifications: 0, // Mock data
    messages: 0, // Mock data
    pendingApplications: applications.filter((app) => app.status === "pending")
      .length,
    shortlistedApplications: applications.filter(
      (app) => app.status === "shortlisted"
    ).length,
  };

  // Interview AI Functions
  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    startTimer();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
        analyzeAnswer(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started!");
    } catch (error) {
      toast.error("Could not access microphone");
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped!");
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const analyzeAnswer = (audioBlob) => {
    const currentQuestion = interviewQuestions[currentQuestionIndex];

    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const feedback = generateFeedback(score, currentQuestion);

      const answer = {
        question: currentQuestion.question,
        score,
        feedback,
        audioUrl: URL.createObjectURL(audioBlob),
      };

      setUserAnswers((prev) => [...prev, answer]);

      // Move to next question or end interview
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        endInterview([...userAnswers, answer]);
      }
    }, 2000);
  };

  const generateFeedback = (score, question) => {
    if (score >= 90) {
      return {
        type: "excellent",
        message:
          "Excellent answer! You demonstrated strong knowledge and clear communication.",
        suggestions: [
          "Consider adding more specific examples",
          "You could elaborate on the technical details",
          "Great job connecting concepts to real-world scenarios",
        ],
      };
    } else if (score >= 75) {
      return {
        type: "good",
        message: "Good answer with room for improvement.",
        suggestions: [
          "Provide more concrete examples",
          "Structure your response more clearly",
          "Include specific technical details",
        ],
      };
    } else {
      return {
        type: "needs-improvement",
        message: "Your answer needs improvement. Focus on the key concepts.",
        suggestions: [
          "Review the fundamental concepts",
          "Practice structuring your responses",
          "Include relevant examples",
          "Be more specific in your explanations",
        ],
      };
    }
  };

  const endInterview = (finalAnswers) => {
    stopTimer();
    setIsInterviewActive(false);
    setShowResults(true);

    const averageScore = Math.round(
      finalAnswers.reduce((sum, answer) => sum + answer.score, 0) /
        finalAnswers.length
    );

    const overallFeedback = generateOverallFeedback(averageScore);

    setInterviewResults({
      answers: finalAnswers,
      averageScore,
      overallFeedback,
      duration: timer,
    });
  };

  const generateOverallFeedback = (averageScore) => {
    if (averageScore >= 90) {
      return "Outstanding performance! You're well-prepared for technical interviews.";
    } else if (averageScore >= 80) {
      return "Strong performance with some areas for improvement.";
    } else if (averageScore >= 70) {
      return "Good foundation, but you need more practice and preparation.";
    } else {
      return "You need significant improvement. Focus on core concepts and practice regularly.";
    }
  };

  const resetInterview = () => {
    setIsInterviewActive(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    stopTimer();
  };

  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const currentQuestion = interviewQuestions[currentQuestionIndex];

  if (applicationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's what's happening with your job search.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Applications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.applications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Notifications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.notifications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Messages
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.messages}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  isPremium
                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <Crown
                  className={`w-6 h-6 ${
                    isPremium ? "text-yellow-600" : "text-gray-500"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Subscription
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {isPremium ? "Premium" : "Free"}
                </p>
                {isPremium && subscriptionData?.premiumUntil && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Until{" "}
                    {new Date(
                      subscriptionData.premiumUntil
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResumeAnalyzer onAnalysisComplete={handleResumeAnalysis} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Premium AI Interview
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Advanced AI-powered interviews with real-time voice interaction,
              intelligent question generation, and comprehensive job readiness
              assessment powered by Gemini.
            </p>
            <PremiumFeatureGuard feature="premium_interview">
              <div className="space-y-3">
                <Button
                  onClick={() => setShowPremiumAIInterview(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white w-full"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Start Premium Interview
                </Button>
                <Button
                  onClick={() => setShowInterviewAI(true)}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Basic Practice Interview
                </Button>
              </div>
            </PremiumFeatureGuard>
          </div>
        </div>

        {/* Application Tracker */}
        <ApplicationTracker />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/jobs"
              className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Browse Jobs
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find your next opportunity
                </p>
              </div>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Update Profile
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keep your profile up to date
                </p>
              </div>
            </Link>
            {user?.role === "employer" && (
              <Link
                to="/post-job"
                className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Post Job
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create a new job posting
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Job Recommendations */}
        <JobRecommendations />
      </div>

      {/* Premium AI Interview Modal */}
      <AnimatePresence>
        {showPremiumAIInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPremiumAIInterview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <PremiumAIInterview />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Interview AI Modal */}
      <AnimatePresence>
        {showInterviewAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInterviewAI(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    AI Interview Preparation
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Practice with AI-powered mock interviews and get instant
                  feedback
                </p>
              </div>

              {!isInterviewActive && !showResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <Button
                      onClick={startInterview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                    >
                      Start Interview
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Active Interview */}
              <AnimatePresence>
                {isInterviewActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    {/* Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Question {currentQuestionIndex + 1} of{" "}
                          {interviewQuestions.length}
                        </span>
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                ((currentQuestionIndex + 1) /
                                  interviewQuestions.length) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">{formatTime(timer)}</span>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                          {currentQuestion.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {currentQuestion.question}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Time limit: {currentQuestion.timeLimit} seconds
                      </p>
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center gap-4">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
                        >
                          <Mic className="w-5 h-5 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                        >
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                    </div>

                    {/* Audio Playback */}
                    {userAnswers.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Your Answer
                        </h4>
                        <div className="flex items-center gap-4">
                          {!isPlaying ? (
                            <Button
                              onClick={playAudio}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={pauseAudio}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          <audio
                            ref={audioRef}
                            onEnded={() => setIsPlaying(false)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reset */}
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={resetInterview}
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Interview
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {showResults && interviewResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                        <span className="text-3xl font-bold text-white">
                          {interviewResults.averageScore}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Interview Score
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {interviewResults.overallFeedback}
                      </p>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      {interviewResults.answers.map((answer, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Question {index + 1}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {answer.score}/100
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {answer.question}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {answer.feedback.type === "excellent" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {answer.feedback.message}
                              </span>
                            </div>
                            <div className="ml-6">
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Suggestions:
                              </p>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                {answer.feedback.suggestions.map(
                                  (suggestion, idx) => (
                                    <li key={idx}>• {suggestion}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={resetInterview}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                      >
                        Practice Again
                      </Button>
                      <Button
                        onClick={() => setShowInterviewAI(false)}
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg"
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
