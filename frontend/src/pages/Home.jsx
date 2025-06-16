import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Search,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Code,
  Database,
  Palette,
  UserCheck,
  Briefcase,
  FileText,
  Sparkles,
  Target,
  MessageCircle,
  Heart,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  ChevronRight,
  Play,
  Quote,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const rotateAnimation = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
      if (isInView) {
        let startTime = null;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min(
            (currentTime - startTime) / (duration * 1000),
            1
          );
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}+</span>;
  };

  // Mock data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content:
        "SkillSync helped me find my dream job in just 2 weeks! The AI matching is incredible.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLab",
      content:
        "The resume analyzer improved my ATS score by 40%. I got 3 interviews in the first week!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director",
      company: "GrowthStart",
      content:
        "As an employer, SkillSync has transformed our hiring process. We find better candidates faster.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const latestJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=50&h=50&fit=crop",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "DesignStudio",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Full-time",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Remote",
      salary: "$130k - $160k",
      type: "Full-time",
      posted: "1 week ago",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=50&h=50&fit=crop",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Find Your Dream Job with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                AI-Powered{" "}
              </span>
              Precision
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              SkillSync combines advanced AI technology with comprehensive job
              matching to help you discover opportunities that perfectly align
              with your skills and career goals.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      window.location.href = `/jobs?search=${encodeURIComponent(
                        search.trim()
                      )}`;
                    }
                  }}
                  placeholder="Search for jobs, skills, or companies..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
                <button
                  onClick={() => {
                    if (search.trim()) {
                      window.location.href = `/jobs?search=${encodeURIComponent(
                        search.trim()
                      )}`;
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                >
                  Search
                </button>
              </div>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Popular:
              </span>
              {[
                "Software Engineer",
                "Data Scientist",
                "Product Manager",
                "UX Designer",
              ].map((tag, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Job category filter functionality
                    window.location.href = `/jobs?category=${encodeURIComponent(
                      tag
                    )}`;
                  }}
                  className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Browse Jobs
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-blue-600 text-blue-600 dark:border-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose SkillSync?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced AI technology meets human expertise to create the
              ultimate job search and career development platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                description:
                  "Our advanced AI analyzes your skills, experience, and preferences to find the perfect job matches.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Target,
                title: "Interview Preparation",
                description:
                  "Practice with AI-powered mock interviews and get instant feedback to improve your performance.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: FileText,
                title: "Resume Optimization",
                description:
                  "Get ATS-friendly resume suggestions and optimization tips to increase your application success rate.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: TrendingUp,
                title: "Career Analytics",
                description:
                  "Track your application progress, interview performance, and career growth with detailed analytics.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: MessageCircle,
                title: "Smart Communication",
                description:
                  "AI-powered messaging and communication tools to connect with employers and recruiters effectively.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Users,
                title: "Community Support",
                description:
                  "Join a community of professionals, share experiences, and get support from peers and mentors.",
                color: "from-teal-500 to-blue-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => {
                  // Navigate to relevant sections based on feature
                  const routes = {
                    "AI-Powered Matching": "/dashboard",
                    "Interview Preparation": "/dashboard",
                    "Resume Optimization": "/dashboard",
                    "Career Analytics": "/dashboard",
                    "Smart Communication": "/dashboard",
                    "Community Support": "/dashboard",
                  };
                  const route = routes[feature.title] || "/dashboard";
                  window.location.href = route;
                }}
                className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
              Join thousands of professionals who have found their dream jobs
              with SkillSync.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Users" },
              { number: "10K+", label: "Jobs Posted" },
              { number: "95%", label: "Success Rate" },
              { number: "500+", label: "Companies" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 dark:text-blue-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Latest Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the newest job openings from top companies around the
              world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {latestJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      // Favorite functionality
                      alert("Favorite feature coming soon!");
                    }}
                  >
                    <Heart className="w-5 h-5" />
                  </motion.div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {job.posted}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    Apply Now
                  </Link>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/jobs"
              className="bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto inline-flex"
            >
              View All Jobs
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from professionals who have transformed their careers with
              SkillSync.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs
              with SkillSync. Start your journey today!
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => {
                  // Demo video functionality - could open a modal or redirect to demo page
                  alert("Demo video feature coming soon!");
                }}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
