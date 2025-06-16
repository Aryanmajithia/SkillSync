import React, { useState } from "react";
import { Calendar, Clock, User, Tag, Search, Filter } from "lucide-react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "career", name: "Career Development" },
    { id: "resume", name: "Resume Tips" },
    { id: "interview", name: "Interview Prep" },
    { id: "tech", name: "Technology" },
    { id: "remote", name: "Remote Work" },
    { id: "leadership", name: "Leadership" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for ATS-Optimized Resumes in 2025",
      excerpt:
        "Learn how to create resumes that pass through Applicant Tracking Systems and get you noticed by hiring managers.",
      content:
        "In today's competitive job market, having an ATS-optimized resume is crucial for getting past the initial screening process. This comprehensive guide covers everything from keyword optimization to formatting best practices...",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "resume",
      tags: ["ATS", "Resume", "Job Search"],
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
    {
      id: 2,
      title: "The Future of Remote Work: Trends and Predictions",
      excerpt:
        "Explore the evolving landscape of remote work and what it means for job seekers and employers alike.",
      content:
        "Remote work has transformed from a temporary solution to a permanent fixture in the modern workplace. This article examines current trends, challenges, and opportunities in the remote work ecosystem...",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "remote",
      tags: ["Remote Work", "Future of Work", "Workplace"],
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Mastering Behavioral Interview Questions",
      excerpt:
        "A complete guide to answering behavioral interview questions with confidence and authenticity.",
      content:
        "Behavioral interview questions are designed to assess how you've handled situations in the past. This guide provides frameworks and examples to help you structure compelling responses...",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "interview",
      tags: ["Interview", "Behavioral Questions", "Career"],
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Building a Personal Brand for Career Success",
      excerpt:
        "Learn how to develop and maintain a strong personal brand that opens doors to new opportunities.",
      content:
        "Your personal brand is more than just your online presence—it's the story you tell about your professional journey. Discover strategies for building an authentic and compelling personal brand...",
      author: "David Kim",
      date: "2024-01-08",
      readTime: "15 min read",
      category: "career",
      tags: ["Personal Brand", "Career Growth", "Networking"],
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "AI in Recruitment: What Job Seekers Need to Know",
      excerpt:
        "Understanding how artificial intelligence is changing the recruitment process and how to adapt.",
      content:
        "Artificial intelligence is revolutionizing how companies find and evaluate candidates. This article explores the impact of AI on recruitment and provides tips for job seekers to navigate this new landscape...",
      author: "Lisa Wang",
      date: "2024-01-05",
      readTime: "11 min read",
      category: "tech",
      tags: ["AI", "Recruitment", "Technology"],
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Leadership Skills for the Modern Workplace",
      excerpt:
        "Essential leadership skills that will help you advance in your career and inspire your team.",
      content:
        "Effective leadership goes beyond managing tasks—it's about inspiring others, fostering collaboration, and driving results. Learn the key skills that define successful leaders in today's workplace...",
      author: "Robert Taylor",
      date: "2024-01-03",
      readTime: "14 min read",
      category: "leadership",
      tags: ["Leadership", "Management", "Career Growth"],
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              SkillSync Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Insights, tips, and resources to help you advance your career and
              find your dream job.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "all" && !searchTerm && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Article
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {
                        categories.find((c) => c.id === featuredPost.category)
                          ?.name
                      }
                    </span>
                    <span className="text-gray-500 text-sm">
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.author}</span>
                      <Calendar className="w-4 h-4 ml-4" />
                      <span className="text-sm">
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </span>
                    </div>

                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {categories.find((c) => c.id === post.category)?.name}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{post.author}</span>
                  </div>

                  <span className="text-gray-500 text-sm">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Read Article
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No articles match "${searchTerm}". Try a different search term.`
                : "No articles available in this category."}
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-blue-50 rounded-lg p-8 mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest career insights, job search tips, and industry news
            delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
