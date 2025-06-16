import React, { useState } from "react";
import {
  Search,
  Book,
  Video,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Users,
  Settings,
  Briefcase,
} from "lucide-react";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: Book },
    { id: "account", name: "Account & Profile", icon: Users },
    { id: "jobs", name: "Job Search", icon: Briefcase },
    { id: "resume", name: "Resume & ATS", icon: FileText },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const helpArticles = [
    {
      id: 1,
      title: "How to Create an Account",
      category: "account",
      content:
        "Learn how to sign up for SkillSync and create your professional profile.",
      tags: ["account", "signup", "profile"],
      video: true,
      popular: true,
    },
    {
      id: 2,
      title: "Optimizing Your Resume for ATS",
      category: "resume",
      content:
        "Get tips on how to make your resume ATS-friendly and increase your chances of getting noticed.",
      tags: ["resume", "ATS", "optimization"],
      video: true,
      popular: true,
    },
    {
      id: 3,
      title: "Finding the Right Job",
      category: "jobs",
      content:
        "Learn how to use our advanced search filters and AI recommendations to find your dream job.",
      tags: ["job search", "filters", "recommendations"],
      video: false,
      popular: true,
    },
    {
      id: 4,
      title: "Managing Your Job Applications",
      category: "jobs",
      content:
        "Track your applications, set reminders, and stay organized throughout your job search.",
      tags: ["applications", "tracking", "organization"],
      video: false,
      popular: false,
    },
    {
      id: 5,
      title: "Understanding Your ATS Score",
      category: "resume",
      content:
        "Learn what your ATS score means and how to improve it for better job matching.",
      tags: ["ATS score", "analysis", "improvement"],
      video: true,
      popular: false,
    },
    {
      id: 6,
      title: "Privacy and Security Settings",
      category: "settings",
      content:
        "Control your privacy settings and manage how your information is shared with employers.",
      tags: ["privacy", "security", "settings"],
      video: false,
      popular: false,
    },
    {
      id: 7,
      title: "Using AI Job Recommendations",
      category: "jobs",
      content:
        "Understand how our AI works and how to get better job recommendations.",
      tags: ["AI", "recommendations", "matching"],
      video: true,
      popular: false,
    },
    {
      id: 8,
      title: "Updating Your Profile Information",
      category: "account",
      content:
        "Keep your profile up-to-date with the latest information and achievements.",
      tags: ["profile", "update", "information"],
      video: false,
      popular: false,
    },
  ];

  const filteredArticles = helpArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const popularArticles = helpArticles.filter((article) => article.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find answers to your questions and learn how to make the most of
              SkillSync.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </a>
                  <a
                    href="/faq"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    FAQ
                  </a>
                  <a
                    href="/feedback"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Send Feedback
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Popular Articles */}
            {!searchTerm && selectedCategory === "all" && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {popularArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {article.title}
                        </h3>
                        {article.video && (
                          <Video className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{article.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "All Articles"}
                </h2>
                <span className="text-gray-600">
                  {filteredArticles.length} articles
                </span>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {article.video && (
                            <Video className="w-5 h-5 text-blue-600" />
                          )}
                          {article.popular && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{article.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Read More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? `No articles match "${searchTerm}". Try a different search term.`
                      : "No articles available in this category."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/faq"
                      className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      View FAQ
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Still Need Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team during business hours.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll respond within 24 hours.
              </p>
              <a
                href="/contact"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Send Email
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phone Support
              </h3>
              <p className="text-gray-600 mb-4">
                Call us directly for immediate assistance with urgent issues.
              </p>
              <a
                href="tel:+15551234567"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
