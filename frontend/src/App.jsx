import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
