import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import {
  ChevronDown,
  User,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  HelpCircle,
  FileText,
  Info,
  Crown,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm relative border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 dark:text-white"
          >
            SkillSync
          </Link>

          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/jobs"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Jobs
              </Link>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Resources
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {isResourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-2">
                      <Link
                        to="/about"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <Info className="w-4 h-4 mr-3" />
                        About
                      </Link>
                      <Link
                        to="/blog"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Blog
                      </Link>
                      <Link
                        to="/help"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Briefcase className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/career-insights"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Crown className="w-4 h-4 mr-3 text-purple-500" />
                        <span className="flex items-center">
                          Career Insights
                          <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                            AI
                          </span>
                        </span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/messages"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4 mr-3" />
                        Messages
                      </Link>
                      <Link
                        to="/gemini-interview"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Crown className="w-4 h-4 mr-3 text-yellow-500" />
                        <span className="flex items-center">
                          Premium Interview
                          <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                            PRO
                          </span>
                        </span>
                      </Link>
                      <Link
                        to="/subscription"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Crown className="w-4 h-4 mr-3 text-blue-500" />
                        Subscription
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/jobs"
            className="block px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Jobs
          </Link>
          <Link
            to="/blog"
            className="block px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Blog
          </Link>
          <Link
            to="/help"
            className="block px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Help
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isResourcesOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsResourcesOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
