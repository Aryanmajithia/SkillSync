import React from "react";
import { Cookie, Settings, Shield, Eye } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your
              experience on SkillSync.
            </p>
            <p className="text-sm opacity-90">Last updated: January 15, 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-12">
            {/* What are Cookies */}
            <section>
              <div className="flex items-start gap-4 mb-6">
                <Cookie className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What are Cookies?
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Cookies are small text files that are stored on your device
                    when you visit our website. They help us provide you with a
                    better experience by remembering your preferences and
                    analyzing how you use our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Essential Cookies
                  </h3>
                  <p className="text-gray-600 mb-2">
                    These cookies are necessary for the website to function
                    properly. They enable basic functions like page navigation
                    and access to secure areas of the website.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Authentication, session
                    management, security features
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-600 mb-2">
                    These cookies help us understand how visitors interact with
                    our website by collecting and reporting information
                    anonymously.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Google Analytics, page views,
                    user behavior tracking
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Preference Cookies
                  </h3>
                  <p className="text-gray-600 mb-2">
                    These cookies allow the website to remember information that
                    changes the way the website behaves or looks.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Language preferences, theme
                    settings, search filters
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Marketing Cookies
                  </h3>
                  <p className="text-gray-600 mb-2">
                    These cookies are used to track visitors across websites to
                    display relevant and engaging advertisements.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Social media integration,
                    advertising networks, retargeting
                  </p>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section>
              <div className="flex items-start gap-4 mb-6">
                <Settings className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Managing Your Cookie Preferences
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You have control over which cookies are stored on your
                    device. You can manage your preferences through your browser
                    settings or our cookie consent manager.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Browser Settings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Most web browsers allow you to control cookies through their
                    settings preferences. However, limiting cookies may impact
                    the functionality of our website.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-6">
                    <li>
                      Chrome: Settings → Privacy and security → Cookies and
                      other site data
                    </li>
                    <li>
                      Firefox: Options → Privacy & Security → Cookies and Site
                      Data
                    </li>
                    <li>Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>
                      Edge: Settings → Cookies and site permissions → Cookies
                      and site data
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cookie Consent Manager
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You can update your cookie preferences at any time using our
                    cookie consent manager.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Manage Cookie Preferences
                  </button>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Third-Party Cookies
              </h2>
              <p className="text-gray-600 mb-4">
                We may use third-party services that set their own cookies.
                These services help us provide better functionality and analyze
                website usage.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Third-Party Services We Use
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Google Analytics
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Website analytics and performance monitoring
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Google Ads</h4>
                    <p className="text-gray-600 text-sm">
                      Advertising and remarketing campaigns
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Social Media Platforms
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Social sharing and integration features
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <div className="flex items-start gap-4 mb-6">
                <Shield className="w-8 h-8 text-red-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Data Protection
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We are committed to protecting your privacy and ensuring the
                    security of your personal information. Our use of cookies
                    complies with applicable data protection laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the new policy on our website.
              </p>
            </section>

            {/* Contact */}
            <section>
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Questions About Cookies?
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our use of cookies or this
                  Cookie Policy, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> privacy@skillsync.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Innovation Drive, San
                    Francisco, CA 94105
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
