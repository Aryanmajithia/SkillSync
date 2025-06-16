import React from "react";
import { Shield, Eye, Lock, Database, Users, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your privacy is important to me. Learn how I collect, use, and
              protect your personal information in this portfolio project.
            </p>
            <p className="text-sm opacity-90">Last updated: January 15, 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Table of Contents */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Table of Contents
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a
                  href="#information-we-collect"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  1. Information We Collect
                </a>
                <a
                  href="#how-we-use-information"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  2. How We Use Information
                </a>
                <a
                  href="#information-sharing"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  3. Information Sharing
                </a>
                <a
                  href="#data-security"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  4. Data Security
                </a>
                <a
                  href="#your-rights"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  5. Your Rights
                </a>
              </div>
              <div className="space-y-2">
                <a
                  href="#cookies"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  6. Cookies & Tracking
                </a>
                <a
                  href="#third-party"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  7. Third-Party Services
                </a>
                <a
                  href="#children"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  8. Children's Privacy
                </a>
                <a
                  href="#international"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  9. International Transfers
                </a>
                <a
                  href="#changes"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  10. Policy Changes
                </a>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Information We Collect */}
            <section id="information-we-collect">
              <div className="flex items-start gap-4 mb-6">
                <Database className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-gray-600 mb-4">
                    I collect information you provide directly to me,
                    information I obtain automatically when you use this
                    project, and information from third-party sources.
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Name, email address, and contact information</li>
                    <li>
                      Professional information (resume, work history, skills)
                    </li>
                    <li>Account credentials and profile information</li>
                    <li>Communication preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Usage Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Log data (IP address, browser type, pages visited)</li>
                    <li>Device information and identifiers</li>
                    <li>Usage patterns and interactions with our platform</li>
                    <li>Search queries and job application history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Third-Party Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>
                      Information from social media platforms (with your
                      consent)
                    </li>
                    <li>Professional networking data</li>
                    <li>Publicly available information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="how-we-use-information">
              <div className="flex items-start gap-4 mb-6">
                <Users className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. How We Use Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    I use the information I collect to provide, improve, and
                    personalize this project's services, communicate with you,
                    and ensure platform security.
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Service Provision
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Creating and managing your account</li>
                    <li>Providing job matching and recommendations</li>
                    <li>Processing job applications and communications</li>
                    <li>Delivering personalized content and features</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Project Improvement
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Analyzing usage patterns and trends</li>
                    <li>Developing new features and services</li>
                    <li>Improving AI algorithms and matching accuracy</li>
                    <li>Conducting research and analytics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Communication
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Sending important service updates and notifications</li>
                    <li>Providing customer support and assistance</li>
                    <li>Marketing communications (with your consent)</li>
                    <li>Responding to inquiries and feedback</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing">
              <div className="flex items-start gap-4 mb-6">
                <Globe className="w-8 h-8 text-purple-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. Information Sharing
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We do not sell your personal information. We may share your
                    information in limited circumstances as described below.
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    With Your Consent
                  </h3>
                  <p className="text-gray-600">
                    We may share your information with third parties when you
                    explicitly consent to such sharing, such as when applying
                    for jobs or connecting with employers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Service Providers
                  </h3>
                  <p className="text-gray-600">
                    We may share information with trusted service providers who
                    assist us in operating our platform, such as hosting
                    providers, analytics services, and customer support tools.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Legal Requirements
                  </h3>
                  <p className="text-gray-600">
                    We may disclose information when required by law, to protect
                    our rights and safety, or to comply with legal processes and
                    regulations.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="w-8 h-8 text-red-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Data Security
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Security Measures
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication systems</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Data Retention
                  </h3>
                  <p className="text-gray-600">
                    We retain your personal information only as long as
                    necessary to provide our services, comply with legal
                    obligations, resolve disputes, and enforce our agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="w-8 h-8 text-orange-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Your Rights
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You have certain rights regarding your personal information,
                    including the right to access, correct, delete, and control
                    how we use your data.
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Access and Control
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Communication Preferences
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Opt out of marketing communications</li>
                    <li>Control email notification settings</li>
                    <li>Manage privacy and visibility settings</li>
                    <li>Withdraw consent for data processing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies & Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage, and provide personalized content.
              </p>
              <div className="ml-12 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Types of Cookies
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>
                      <strong>Essential cookies:</strong> Required for basic
                      platform functionality
                    </li>
                    <li>
                      <strong>Analytics cookies:</strong> Help us understand how
                      users interact with our platform
                    </li>
                    <li>
                      <strong>Preference cookies:</strong> Remember your
                      settings and preferences
                    </li>
                    <li>
                      <strong>Marketing cookies:</strong> Used for targeted
                      advertising (with consent)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section id="third-party">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Third-Party Services
              </h2>
              <p className="text-gray-600 mb-4">
                Our platform may integrate with third-party services and
                websites. We are not responsible for the privacy practices of
                these external services.
              </p>
            </section>

            {/* Children's Privacy */}
            <section id="children">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 16 years of
                age. We do not knowingly collect personal information from
                children under 16.
              </p>
            </section>

            {/* International Transfers */}
            <section id="international">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. International Transfers
              </h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data.
              </p>
            </section>

            {/* Policy Changes */}
            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Policy Changes
              </h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                our platform and updating the "Last updated" date.
              </p>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-16 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> privacy@skillsync.com
              </p>
              <p>
                <strong>Address:</strong> 123 Innovation Drive, San Francisco,
                CA 94105
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
