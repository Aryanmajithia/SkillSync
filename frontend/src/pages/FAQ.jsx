import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const faqData = {
    general: [
      {
        id: "general-1",
        question: "What is SkillSync?",
        answer:
          "SkillSync is an AI-powered job portal that connects talented professionals with innovative companies. We use advanced algorithms to match job seekers with opportunities that align with their skills, experience, and career goals.",
      },
      {
        id: "general-2",
        question: "How is SkillSync different from other job sites?",
        answer:
          "SkillSync stands out through our AI-powered matching system, comprehensive career development tools, ATS optimization features, and personalized learning recommendations. We focus on quality matches rather than quantity.",
      },
      {
        id: "general-3",
        question: "Is SkillSync free to use?",
        answer:
          "Yes! SkillSync offers a free tier with access to job search, basic profile features, and limited AI analysis. We also offer premium plans with advanced features like unlimited resume analysis, priority support, and exclusive job opportunities.",
      },
      {
        id: "general-4",
        question: "What types of jobs are available on SkillSync?",
        answer:
          "SkillSync features jobs across all industries and experience levels, from entry-level positions to executive roles. We have a strong focus on technology, marketing, sales, design, and other high-growth sectors.",
      },
    ],
    account: [
      {
        id: "account-1",
        question: "How do I create an account?",
        answer:
          "Creating an account is simple! Click the 'Sign Up' button on our homepage, fill in your basic information, choose your role (job seeker or employer), and verify your email address. You can also sign up using your Google or LinkedIn account.",
      },
      {
        id: "account-2",
        question: "Can I have both a job seeker and employer account?",
        answer:
          "Currently, you can only have one account type per email address. However, you can switch between job seeker and employer modes within your account settings if you need to both search for jobs and post job opportunities.",
      },
      {
        id: "account-3",
        question: "How do I reset my password?",
        answer:
          "If you've forgotten your password, click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a secure link to reset your password. The link will expire after 24 hours for security.",
      },
      {
        id: "account-4",
        question: "How do I delete my account?",
        answer:
          "To delete your account, go to your profile settings and scroll to the bottom. Click 'Delete Account' and follow the confirmation process. Please note that this action is irreversible and will permanently remove all your data.",
      },
    ],
    resume: [
      {
        id: "resume-1",
        question: "What is ATS optimization?",
        answer:
          "ATS (Applicant Tracking System) optimization ensures your resume can be properly read and parsed by automated systems used by most companies. Our AI analyzes your resume for keyword optimization, formatting, and structure to improve your chances of getting noticed.",
      },
      {
        id: "resume-2",
        question: "What file formats does SkillSync accept for resumes?",
        answer:
          "SkillSync accepts PDF, DOC, and DOCX files for resume uploads. We recommend using PDF format for the best compatibility and formatting preservation. The maximum file size is 5MB.",
      },
      {
        id: "resume-3",
        question: "How accurate is the AI resume analysis?",
        answer:
          "Our AI resume analysis has an accuracy rate of over 85%. It analyzes skills, experience, formatting, and provides specific improvement suggestions. However, we recommend reviewing the suggestions and making adjustments based on your specific situation.",
      },
      {
        id: "resume-4",
        question: "Can I upload multiple versions of my resume?",
        answer:
          "Yes! You can upload multiple resume versions and customize them for different types of positions. Our platform allows you to manage multiple resumes and choose the most appropriate one for each job application.",
      },
    ],
    jobSearch: [
      {
        id: "search-1",
        question: "How does the AI job matching work?",
        answer:
          "Our AI analyzes your profile, skills, experience, and preferences to find jobs that best match your qualifications. It considers factors like required skills, experience level, location, salary expectations, and company culture to provide personalized recommendations.",
      },
      {
        id: "search-2",
        question: "Can I save job searches?",
        answer:
          "Yes! You can save your job searches and set up email alerts for new positions that match your criteria. This way, you'll be notified when relevant opportunities become available without having to constantly check the platform.",
      },
      {
        id: "search-3",
        question: "How do I apply for jobs?",
        answer:
          "When you find a job you're interested in, click the 'Apply' button. You can either apply directly through SkillSync or be redirected to the company's application portal, depending on how the employer has set up their application process.",
      },
      {
        id: "search-4",
        question: "Can I track my job applications?",
        answer:
          "Absolutely! SkillSync provides an application tracker where you can monitor the status of all your applications, set reminders for follow-ups, and organize your job search process effectively.",
      },
    ],
    employers: [
      {
        id: "employer-1",
        question: "How much does it cost to post a job?",
        answer:
          "We offer various pricing plans for employers. Basic job postings start at $99 per month, while premium plans with advanced features like AI candidate matching and analytics start at $299 per month. Contact our sales team for custom enterprise solutions.",
      },
      {
        id: "employer-2",
        question: "How long do job postings stay active?",
        answer:
          "Job postings remain active for 30 days by default. You can extend the posting period, pause it temporarily, or close it early at any time through your employer dashboard.",
      },
      {
        id: "employer-3",
        question: "Can I see analytics for my job postings?",
        answer:
          "Yes! Our employer dashboard provides detailed analytics including views, applications, candidate quality scores, and demographic information. Premium plans include advanced analytics and reporting features.",
      },
      {
        id: "employer-4",
        question: "How does the AI candidate matching work for employers?",
        answer:
          "Our AI analyzes job requirements and candidate profiles to provide ranked recommendations of the best-fit candidates. It considers skills, experience, location preferences, and cultural fit to help you find the perfect match.",
      },
    ],
    privacy: [
      {
        id: "privacy-1",
        question: "How does SkillSync protect my personal information?",
        answer:
          "We take data security seriously. All personal information is encrypted, and we follow industry best practices for data protection. We never sell your personal data to third parties and only share information with your explicit consent.",
      },
      {
        id: "privacy-2",
        question: "Can employers see my contact information?",
        answer:
          "Your contact information is only shared with employers when you explicitly apply for a job or choose to make it visible. You have full control over what information is displayed on your public profile.",
      },
      {
        id: "privacy-3",
        question: "How do I control my privacy settings?",
        answer:
          "You can manage your privacy settings in your account dashboard. You can control profile visibility, email preferences, data sharing settings, and choose what information is displayed to employers.",
      },
    ],
  };

  const categories = [
    { id: "general", name: "General", icon: "🏠" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "resume", name: "Resume & ATS", icon: "📄" },
    { id: "jobSearch", name: "Job Search", icon: "🔍" },
    { id: "employers", name: "Employers", icon: "🏢" },
    { id: "privacy", name: "Privacy & Security", icon: "🔒" },
  ];

  const filteredFAQs =
    faqData[activeCategory]?.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions about SkillSync and how to make
              the most of our platform.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
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
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categories.find((c) => c.id === activeCategory)?.name}{" "}
                  Questions
                </h2>
                <p className="text-gray-600">
                  {filteredFAQs.length} questions found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="p-6">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full text-left flex items-start justify-between"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {expandedItems.has(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        )}
                      </button>

                      {expandedItems.has(faq.id) && (
                        <div className="mt-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No questions found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? `No questions match "${searchTerm}". Try a different search term.`
                        : "No questions available in this category."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Still Need Help */}
            <div className="bg-blue-50 rounded-lg p-8 mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is
                here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/help"
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
