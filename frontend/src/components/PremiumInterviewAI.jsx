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
  Crown,
  Zap,
  TrendingUp,
  MessageSquare,
  FileText,
  DollarSign,
  Lock,
  Unlock,
  Volume2,
  Settings,
  Headphones,
  Video,
  Calendar,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const PremiumInterviewAI = () => {
  const { user } = useAuth();
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [interviewResults, setInterviewResults] = useState(null);
  const [selectedRole, setSelectedRole] = useState("software-engineer");
  const [selectedLevel, setSelectedLevel] = useState("mid-level");
  const [selectedIndustry, setSelectedIndustry] = useState("technology");
  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Mock premium status
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Role configurations
  const roleConfigs = {
    "software-engineer": {
      title: "Software Engineer",
      skills: [
        "Programming",
        "Problem Solving",
        "System Design",
        "Collaboration",
      ],
      questions: [
        "Can you walk me through a challenging technical problem you solved?",
        "How do you approach debugging a production issue?",
        "Describe a time when you had to learn a new technology quickly.",
        "How do you handle conflicting requirements from different stakeholders?",
      ],
    },
    "product-manager": {
      title: "Product Manager",
      skills: [
        "Product Strategy",
        "User Research",
        "Data Analysis",
        "Leadership",
      ],
      questions: [
        "How do you prioritize features in a product roadmap?",
        "Describe a product launch that didn't go as planned.",
        "How do you gather and validate user requirements?",
        "Tell me about a time you had to make a difficult product decision.",
      ],
    },
    "data-scientist": {
      title: "Data Scientist",
      skills: [
        "Statistical Analysis",
        "Machine Learning",
        "Data Visualization",
        "Business Acumen",
      ],
      questions: [
        "How do you validate the results of a machine learning model?",
        "Describe a data analysis project that led to actionable insights.",
        "How do you handle missing or inconsistent data?",
        "Tell me about a time you had to explain complex data to non-technical stakeholders.",
      ],
    },
  };

  const currentConfig = roleConfigs[selectedRole];

  // Start premium interview
  const startPremiumInterview = async () => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }

    setIsInterviewActive(true);
    setConversationHistory([]);
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    startTimer();

    // Generate first question using Gemini
    await generateNextQuestion();
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

  // Generate next question using Gemini
  const generateNextQuestion = async () => {
    setIsProcessing(true);

    try {
      const prompt = `You are an expert interviewer conducting a ${selectedLevel} ${
        currentConfig.title
      } interview. 
      
      Previous conversation: ${conversationHistory
        .map((c) => `${c.role}: ${c.content}`)
        .join("\n")}
      
      Generate the next interview question that:
      1. Is appropriate for ${selectedLevel} level
      2. Focuses on ${currentConfig.skills.join(", ")}
      3. Builds on previous responses
      4. Is specific and actionable
      5. Helps assess job readiness
      
      Return only the question, no additional text.`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: prompt,
          context: "interview",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const question = data.response;
        setCurrentQuestion(question);

        // Add AI question to conversation
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "interviewer",
            content: question,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        // Fallback to predefined questions
        const fallbackQuestions = currentConfig.questions;
        const randomQuestion =
          fallbackQuestions[
            Math.floor(Math.random() * fallbackQuestions.length)
          ];
        setCurrentQuestion(randomQuestion);
      }
    } catch (error) {
      console.error("Error generating question:", error);
      // Fallback to predefined questions
      const fallbackQuestions = currentConfig.questions;
      const randomQuestion =
        fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setCurrentQuestion(randomQuestion);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start listening for user response
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await processUserResponse(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      toast.success("Listening... Speak now!");
    } catch (error) {
      toast.error("Could not access microphone");
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      toast.success("Processing your response...");
    }
  };

  // Process user response with Gemini
  const processUserResponse = async (audioBlob) => {
    setIsProcessing(true);

    try {
      // Convert audio to text (simulated)
      const userResponse =
        "This is a simulated user response. In a real implementation, this would be converted from speech to text using a speech recognition API.";

      // Add user response to conversation
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "candidate",
          content: userResponse,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Analyze response with Gemini
      const analysisPrompt = `You are an expert interviewer analyzing a candidate's response for a ${selectedLevel} ${currentConfig.title} position.

      Question: ${currentQuestion}
      Candidate Response: ${userResponse}
      
      Provide a detailed analysis including:
      1. Score (1-10) with justification
      2. Strengths demonstrated
      3. Areas for improvement
      4. Specific feedback and suggestions
      5. Whether this response shows job readiness
      
      Format as JSON:
      {
        "score": number,
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "feedback": "detailed feedback",
        "jobReady": boolean,
        "confidence": "high/medium/low"
      }`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: analysisPrompt,
          context: "interview-analysis",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = JSON.parse(data.response);

        // Add analysis to conversation
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "analysis",
            content: analysis,
            timestamp: new Date().toISOString(),
          },
        ]);

        // Generate AI feedback response
        await generateAIFeedback(analysis);
      }
    } catch (error) {
      console.error("Error processing response:", error);
      toast.error("Error processing response");
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate AI feedback response
  const generateAIFeedback = async (analysis) => {
    try {
      const feedbackPrompt = `Based on this analysis: ${JSON.stringify(
        analysis
      )}
      
      Generate a helpful, encouraging feedback response that:
      1. Acknowledges strengths
      2. Provides constructive improvement suggestions
      3. Maintains a positive tone
      4. Is specific and actionable
      5. Keeps the interview flowing naturally
      
      Return only the feedback text, no additional formatting.`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: feedbackPrompt,
          context: "interview-feedback",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const feedback = data.response;
        setAiResponse(feedback);

        // Add AI feedback to conversation
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "interviewer",
            content: feedback,
            timestamp: new Date().toISOString(),
          },
        ]);

        // Speak the feedback
        speakText(feedback);
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
    }
  };

  // Text-to-speech functionality
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  // End interview and generate final assessment
  const endInterview = async () => {
    stopTimer();
    setIsInterviewActive(false);
    setIsProcessing(true);

    try {
      const assessmentPrompt = `You are an expert career coach providing a final interview assessment.

      Interview Summary:
      Role: ${currentConfig.title} (${selectedLevel})
      Duration: ${formatTime(timer)}
      Questions Answered: ${
        conversationHistory.filter((c) => c.role === "candidate").length
      }
      
      Conversation History:
      ${conversationHistory.map((c) => `${c.role}: ${c.content}`).join("\n")}
      
      Provide a comprehensive assessment including:
      1. Overall score (1-100)
      2. Job readiness assessment (Ready/Needs Improvement/Not Ready)
      3. Key strengths demonstrated
      4. Critical areas for improvement
      5. Specific recommendations for improvement
      6. Timeline for job readiness
      7. Confidence level in assessment
      
      Format as JSON:
      {
        "overallScore": number,
        "jobReadiness": "Ready/Needs Improvement/Not Ready",
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "recommendations": ["rec1", "rec2"],
        "timeline": "2-3 months",
        "confidence": "high/medium/low",
        "summary": "overall assessment summary"
      }`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: assessmentPrompt,
          context: "final-assessment",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assessment = JSON.parse(data.response);

        setInterviewResults({
          ...assessment,
          duration: timer,
          questionsAnswered: conversationHistory.filter(
            (c) => c.role === "candidate"
          ).length,
          conversationHistory,
        });

        setShowResults(true);
      }
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error("Error generating final assessment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset interview
  const resetInterview = () => {
    setIsInterviewActive(false);
    setConversationHistory([]);
    setCurrentQuestion(null);
    setAiResponse("");
    setTimer(0);
    setShowResults(false);
    setInterviewResults(null);
    stopTimer();
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Premium AI Interview
            </h1>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              PRO
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time AI-powered interviews with Gemini. Get instant feedback
            and comprehensive job readiness assessment.
          </p>
        </div>

        {!isInterviewActive && !showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="software-engineer">Software Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="data-scientist">Data Scientist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="entry-level">Entry Level</option>
                  <option value="mid-level">Mid Level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="ecommerce">E-commerce</option>
                </select>
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Premium Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    AI-powered question generation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Real-time voice interaction
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Comprehensive job readiness assessment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Detailed improvement recommendations
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button
                onClick={startPremiumInterview}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                <Crown className="w-5 h-5 mr-2" />
                Start Premium Interview
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
                    Question{" "}
                    {
                      conversationHistory.filter(
                        (c) => c.role === "interviewer"
                      ).length
                    }{" "}
                    of 5
                  </span>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (conversationHistory.filter(
                            (c) => c.role === "interviewer"
                          ).length /
                            5) *
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

              {/* Current Question */}
              {currentQuestion && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {currentConfig.title} - {selectedLevel}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {currentQuestion}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Headphones className="w-4 h-4" />
                    Click the microphone to answer
                  </div>
                </div>
              )}

              {/* AI Response */}
              {aiResponse && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                      AI Feedback
                    </span>
                    {isSpeaking && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {aiResponse}
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => speakText(aiResponse)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      disabled={isSpeaking}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={generateNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      disabled={isProcessing}
                    >
                      Next Question
                    </Button>
                  </div>
                </div>
              )}

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isListening ? (
                  <Button
                    onClick={startListening}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
                    disabled={isProcessing}
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopListening}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                  >
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                )}

                <Button
                  onClick={endInterview}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg"
                >
                  End Interview
                </Button>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    AI is analyzing your response...
                  </p>
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
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                  <span className="text-4xl font-bold text-white">
                    {interviewResults.overallScore}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Job Readiness Score
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      interviewResults.jobReadiness === "Ready"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : interviewResults.jobReadiness === "Needs Improvement"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {interviewResults.jobReadiness}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Confidence: {interviewResults.confidence}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {interviewResults.summary}
                </p>
              </div>

              {/* Detailed Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {interviewResults.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-green-700 dark:text-green-300"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {interviewResults.improvements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewResults.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                        {index + 1}
                      </div>
                      <p className="text-blue-700 dark:text-blue-300">{rec}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Timeline for Job Readiness:</strong>{" "}
                    {interviewResults.timeline}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetInterview}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg"
                >
                  Practice Again
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowUpgrade(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Upgrade to Premium
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Unlock advanced AI interview features with real-time voice
                    interaction and comprehensive assessments.
                  </p>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      $19.99/month
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        AI-powered question generation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Real-time voice interaction
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Comprehensive job readiness assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Detailed improvement recommendations
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowUpgrade(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Maybe Later
                    </Button>
                    <Button
                      onClick={() => {
                        setIsPremium(true);
                        setShowUpgrade(false);
                        startPremiumInterview();
                      }}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PremiumInterviewAI;
