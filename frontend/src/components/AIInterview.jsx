import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const AIInterview = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interviewResults, setInterviewResults] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("software");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Interview questions by industry and role
  const interviewQuestions = {
    software: {
      developer: [
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
          keywords: [
            "indexing",
            "query optimization",
            "database",
            "performance",
          ],
          sampleAnswer:
            "I would analyze the query execution plan, add appropriate indexes, optimize the query structure, consider caching strategies, and potentially restructure the database schema if needed.",
        },
        {
          question:
            "Describe a challenging project you worked on and how you overcame obstacles.",
          category: "Behavioral",
          timeLimit: 120,
          keywords: [
            "problem-solving",
            "collaboration",
            "learning",
            "adaptation",
          ],
          sampleAnswer:
            "I worked on a project with tight deadlines and changing requirements. I used agile methodologies, broke down tasks, communicated regularly with stakeholders, and learned new technologies as needed.",
        },
      ],
      designer: [
        {
          question: "How do you approach user research in your design process?",
          category: "Design",
          timeLimit: 90,
          keywords: [
            "user research",
            "usability",
            "user experience",
            "design thinking",
          ],
          sampleAnswer:
            "I start with understanding user needs through interviews, surveys, and analytics. Then I create personas, user journeys, and prototypes to test and iterate on solutions.",
        },
      ],
    },
    marketing: {
      manager: [
        {
          question:
            "How would you develop a marketing strategy for a new product launch?",
          category: "Strategy",
          timeLimit: 120,
          keywords: [
            "market research",
            "target audience",
            "channels",
            "metrics",
          ],
          sampleAnswer:
            "I would conduct market research, define target audience, choose appropriate marketing channels, create compelling messaging, set KPIs, and develop a timeline for execution.",
        },
      ],
    },
  };

  const currentQuestions =
    interviewQuestions[selectedIndustry]?.[selectedRole] ||
    interviewQuestions.software.developer;

  // Start interview
  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    startTimer();
  };

  // Start timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start recording
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
        // Simulate AI analysis
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

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped!");
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Simulate AI analysis
  const analyzeAnswer = (audioBlob) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    // Simulate processing time
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const feedback = generateFeedback(score, currentQuestion);

      const answerResult = {
        question: currentQuestion.question,
        score,
        feedback,
        duration: timer,
        timestamp: new Date().toISOString(),
      };

      setUserAnswers((prev) => [...prev, answerResult]);

      // Move to next question or end interview
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimer(0);
        startTimer();
      } else {
        endInterview([...userAnswers, answerResult]);
      }
    }, 2000);
  };

  // Generate feedback based on score
  const generateFeedback = (score, question) => {
    if (score >= 90) {
      return {
        type: "excellent",
        message:
          "Excellent answer! You demonstrated strong knowledge and clear communication.",
        suggestions: [
          "Consider adding more specific examples",
          "Great technical depth",
        ],
      };
    } else if (score >= 80) {
      return {
        type: "good",
        message: "Good answer with room for improvement.",
        suggestions: [
          "Provide more specific examples",
          "Structure your response better",
          "Include relevant keywords",
        ],
      };
    } else if (score >= 70) {
      return {
        type: "fair",
        message: "Fair answer, but needs significant improvement.",
        suggestions: [
          "Research the topic more thoroughly",
          "Practice your delivery",
          "Include more technical details",
        ],
      };
    } else {
      return {
        type: "needs-improvement",
        message: "This answer needs substantial improvement.",
        suggestions: [
          "Study the fundamentals",
          "Practice with similar questions",
          "Consider taking relevant courses",
        ],
      };
    }
  };

  // End interview
  const endInterview = (finalAnswers) => {
    stopTimer();
    setIsInterviewActive(false);

    const averageScore =
      finalAnswers.reduce((sum, answer) => sum + answer.score, 0) /
      finalAnswers.length;
    const totalTime = finalAnswers.reduce(
      (sum, answer) => sum + answer.duration,
      0
    );

    setInterviewResults({
      averageScore: Math.round(averageScore),
      totalTime,
      totalQuestions: finalAnswers.length,
      answers: finalAnswers,
      overallFeedback: generateOverallFeedback(averageScore),
    });

    setShowResults(true);
  };

  // Generate overall feedback
  const generateOverallFeedback = (averageScore) => {
    if (averageScore >= 90) {
      return "Outstanding performance! You're well-prepared for technical interviews.";
    } else if (averageScore >= 80) {
      return "Strong performance with some areas for improvement.";
    } else if (averageScore >= 70) {
      return "Good foundation, but needs more practice and preparation.";
    } else {
      return "Consider spending more time preparing and practicing before real interviews.";
    }
  };

  // Reset interview
  const resetInterview = () => {
    setIsInterviewActive(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    stopTimer();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
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
            Practice with AI-powered mock interviews and get instant feedback
          </p>
        </div>

        {!isInterviewActive && !showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="software">Software</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            {/* Start Button */}
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
                    {currentQuestions.length}
                  </span>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            currentQuestions.length) *
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
                    <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
                  </div>
                </div>
              )}

              {/* Skip/Reset */}
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
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg"
                >
                  Download Report
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AIInterview;
