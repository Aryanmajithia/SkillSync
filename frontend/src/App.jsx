import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import PremiumAIInterview from "./components/PremiumAIInterview";
import InterviewAI from "./components/InterviewAI";
import StripeProvider from "./components/StripeProvider";
import SubscriptionManager from "./components/SubscriptionManager";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Help from "./pages/Help";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";

const queryClient = new QueryClient();

// Simple test component
const TestComponent = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">SkillSync</h1>
        <p className="text-gray-600">Application is working!</p>
        <p className="text-sm text-gray-500 mt-2">
          If you can see this, React is rendering correctly.
        </p>
      </div>
    </div>
  );
};

// Simple fallback component
const FallbackComponent = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          SkillSync
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StripeProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/:id" element={<JobDetails />} />

                  {/* Public Pages */}
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="help" element={<Help />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="cookies" element={<CookiePolicy />} />
                  <Route path="accessibility" element={<Accessibility />} />

                  {/* Protected Routes */}
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="post-job"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <PostJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="premium-ai-interview"
                    element={
                      <ProtectedRoute>
                        <PremiumAIInterview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="gemini-interview"
                    element={
                      <ProtectedRoute>
                        <InterviewAI />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="subscription"
                    element={
                      <ProtectedRoute>
                        <SubscriptionManager />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
              <Chatbot />
            </div>
          </Router>
          <Toaster />
        </StripeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
