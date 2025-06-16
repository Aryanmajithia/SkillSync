import React from "react";
import { FileText, AlertTriangle, CheckCircle, Shield } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Please read these terms carefully before using SkillSync. By using
              this portfolio project, you agree to these terms.
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
                  href="#acceptance"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  1. Acceptance of Terms
                </a>
                <a
                  href="#services"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  2. Services Description
                </a>
                <a
                  href="#accounts"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  3. User Accounts
                </a>
                <a
                  href="#conduct"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  4. User Conduct
                </a>
                <a
                  href="#content"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  5. User Content
                </a>
              </div>
              <div className="space-y-2">
                <a
                  href="#intellectual-property"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  6. Intellectual Property
                </a>
                <a
                  href="#privacy"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  7. Privacy Policy
                </a>
                <a
                  href="#disclaimers"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  8. Disclaimers
                </a>
                <a
                  href="#limitation"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  9. Limitation of Liability
                </a>
                <a
                  href="#termination"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  10. Termination
                </a>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section id="acceptance">
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-600 mb-4">
                    By accessing and using SkillSync ("the Project"), you accept
                    and agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please
                    do not use this service.
                  </p>
                </div>
              </div>
            </section>

            {/* Services Description */}
            <section id="services">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Services Description
              </h2>
              <p className="text-gray-600 mb-4">
                SkillSync is a portfolio project that provides an AI-powered job
                portal that connects job seekers with employers. The services
                include:
              </p>
              <div className="ml-6 space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Job posting and application management for employers</li>
                  <li>Job search and application tools for job seekers</li>
                  <li>AI-powered resume analysis and optimization</li>
                  <li>Career development resources and tools</li>
                  <li>Professional networking features</li>
                  <li>Personalized job recommendations</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section id="accounts">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Creation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    To use certain features of the Platform, you must create an
                    account. You agree to provide accurate, current, and
                    complete information during the registration process and to
                    update such information to keep it accurate, current, and
                    complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Security
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You are responsible for safeguarding your account
                    credentials and for all activities that occur under your
                    account. You agree to notify me immediately of any
                    unauthorized use of your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Types
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>
                      <strong>Job Seeker Accounts:</strong> For individuals
                      seeking employment opportunities
                    </li>
                    <li>
                      <strong>Employer Accounts:</strong> For companies and
                      organizations posting job opportunities
                    </li>
                    <li>
                      <strong>Free Accounts:</strong> Basic access to platform
                      features
                    </li>
                    <li>
                      <strong>Premium Accounts:</strong> Enhanced features and
                      capabilities (subject to additional fees)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section id="conduct">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-8 h-8 text-orange-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. User Conduct
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You agree to use the Platform only for lawful purposes and
                    in accordance with these Terms. You agree not to use the
                    Platform:
                  </p>
                </div>
              </div>

              <div className="ml-12 space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    In any way that violates any applicable federal, state,
                    local, or international law or regulation
                  </li>
                  <li>
                    To transmit, or procure the sending of, any advertising or
                    promotional material without our prior written consent
                  </li>
                  <li>
                    To impersonate or attempt to impersonate the Company, a
                    Company employee, another user, or any other person or
                    entity
                  </li>
                  <li>
                    To engage in any other conduct that restricts or inhibits
                    anyone's use or enjoyment of the Platform
                  </li>
                  <li>
                    To introduce viruses, trojans, worms, logic bombs, or other
                    material that is malicious or technologically harmful
                  </li>
                  <li>
                    To attempt to gain unauthorized access to, interfere with,
                    damage, or disrupt any parts of the Platform
                  </li>
                </ul>
              </div>
            </section>

            {/* User Content */}
            <section id="content">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. User Content
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Content Ownership
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You retain ownership of any content you submit, post, or
                    display on the Platform ("User Content"). By submitting User
                    Content, you grant us a worldwide, non-exclusive,
                    royalty-free license to use, reproduce, modify, adapt,
                    publish, translate, and distribute such content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Content Standards
                  </h3>
                  <p className="text-gray-600 mb-4">User Content must not:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-6">
                    <li>
                      Contain any material that is defamatory, obscene,
                      indecent, abusive, offensive, harassing, violent, hateful,
                      inflammatory, or otherwise objectionable
                    </li>
                    <li>
                      Promote sexually explicit or pornographic material,
                      violence, or discrimination
                    </li>
                    <li>
                      Infringe any patent, trademark, trade secret, copyright,
                      or other intellectual property rights
                    </li>
                    <li>Be likely to deceive any person</li>
                    <li>
                      Promote any illegal activity or advocate, promote, or
                      assist any unlawful act
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                The Platform and its original content, features, and
                functionality are and will remain the exclusive property of
                SkillSync and its licensors. The Platform is protected by
                copyright, trademark, and other laws.
              </p>
            </section>

            {/* Privacy Policy */}
            <section id="privacy">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Privacy Policy
              </h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Platform, to
                understand our practices.
              </p>
            </section>

            {/* Disclaimers */}
            <section id="disclaimers">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Disclaimers
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
                  BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, AND HEREBY
                  DISCLAIM ALL WARRANTIES, INCLUDING WITHOUT LIMITATION:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-6">
                  <li>
                    Warranties of merchantability, fitness for a particular
                    purpose, and non-infringement
                  </li>
                  <li>
                    Warranties that the Platform will be uninterrupted, secure,
                    or error-free
                  </li>
                  <li>
                    Warranties regarding the accuracy, reliability, or
                    completeness of any information on the Platform
                  </li>
                  <li>
                    Warranties that defects will be corrected or that the
                    Platform is free of viruses or other harmful components
                  </li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="limitation">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                IN NO EVENT SHALL SKILLSYNC, ITS DIRECTORS, EMPLOYEES, PARTNERS,
                AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            {/* Termination */}
            <section id="termination">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Termination
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We may terminate or suspend your account and bar access to the
                  Platform immediately, without prior notice or liability, under
                  our sole discretion, for any reason whatsoever and without
                  limitation, including but not limited to a breach of the
                  Terms.
                </p>
                <p className="text-gray-600">
                  If you wish to terminate your account, you may simply
                  discontinue using the Platform or contact us to delete your
                  account.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be interpreted and governed by the laws of the
                State of California, without regard to its conflict of law
                provisions.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-16 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> legal@skillsync.com
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
