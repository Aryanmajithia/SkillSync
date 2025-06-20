import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import CareerInsights from "./components/CareerInsights";
import PremiumInterviewAI from "./components/PremiumInterviewAI";
import DataGenerator from "./components/DataGenerator";
import SubscriptionManager from "./components/SubscriptionManager";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import Accessibility from "./pages/Accessibility";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

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
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="help" element={<Help />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="accessibility" element={<Accessibility />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="cookies" element={<CookiePolicy />} />

                  {/* Protected Routes */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="career-insights" element={<CareerInsights />} />
                  <Route
                    path="gemini-interview"
                    element={<PremiumInterviewAI />}
                  />
                  <Route path="data-generator" element={<DataGenerator />} />
                  <Route
                    path="subscription"
                    element={<SubscriptionManager />}
                  />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/:id" element={<JobDetails />} />
                  <Route path="post-job" element={<PostJob />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="notifications" element={<Notifications />} />
                </Route>
              </Routes>
              <Toaster position="top-right" />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
