import React from "react";
import {
  Accessibility,
  Eye,
  Volume2,
  MousePointer,
  Keyboard,
} from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Accessibility Statement
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              We are committed to ensuring that SkillSync is accessible to all
              users, including those with disabilities.
            </p>
            <p className="text-sm opacity-90">Last updated: January 15, 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-12">
            {/* Commitment */}
            <section>
              <div className="flex items-start gap-4 mb-6">
                <Accessibility className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Commitment
                  </h2>
                  <p className="text-gray-600 mb-4">
                    SkillSync is committed to providing a website that is
                    accessible to the widest possible audience, regardless of
                    technology or ability. We actively work to increase the
                    accessibility and usability of our website and in doing so
                    adhere to many of the available standards and guidelines.
                  </p>
                </div>
              </div>
            </section>

            {/* Standards */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Accessibility Standards
              </h2>
              <p className="text-gray-600 mb-6">
                This website endeavors to conform to level AA of the World Wide
                Web Consortium (W3C) Web Content Accessibility Guidelines 2.1.
                These guidelines explain how to make web content more accessible
                for people with disabilities and more user-friendly for
                everyone.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    WCAG 2.1 Level AA
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We strive to meet the Web Content Accessibility Guidelines
                    2.1 Level AA standards, which include requirements for
                    perceivable, operable, understandable, and robust content.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Section 508
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our website complies with Section 508 of the Rehabilitation
                    Act, ensuring federal employees and members of the public
                    with disabilities have access to information and data.
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Accessibility Features
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Eye className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Visual Accessibility
                      </h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• High contrast color schemes</li>
                        <li>• Resizable text (up to 200%)</li>
                        <li>• Clear typography and spacing</li>
                        <li>• Alternative text for images</li>
                        <li>• Consistent navigation structure</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Volume2 className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Audio Accessibility
                      </h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Screen reader compatibility</li>
                        <li>• Audio descriptions for videos</li>
                        <li>• Captioning for multimedia content</li>
                        <li>• Clear audio controls</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Keyboard className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Keyboard Navigation
                      </h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Full keyboard navigation support</li>
                        <li>• Logical tab order</li>
                        <li>• Skip navigation links</li>
                        <li>• Keyboard shortcuts for common actions</li>
                        <li>• Focus indicators for all interactive elements</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MousePointer className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Motor Accessibility
                      </h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Large click targets</li>
                        <li>• Adequate spacing between interactive elements</li>
                        <li>• No time limits for completing actions</li>
                        <li>• Pause, stop, or hide moving content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Assistive Technologies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Assistive Technology Support
              </h2>
              <p className="text-gray-600 mb-6">
                Our website is designed to be compatible with the following
                assistive technologies:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Screen Readers
                  </h3>
                  <p className="text-gray-600 text-sm">
                    JAWS, NVDA, VoiceOver, TalkBack
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Screen Magnifiers
                  </h3>
                  <p className="text-gray-600 text-sm">
                    ZoomText, Windows Magnifier
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Voice Recognition
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Dragon NaturallySpeaking, Voice Control
                  </p>
                </div>
              </div>
            </section>

            {/* Known Issues */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Known Accessibility Issues
              </h2>
              <p className="text-gray-600 mb-4">
                We are aware of some accessibility issues and are working to
                resolve them:
              </p>
              <div className="bg-yellow-50 rounded-lg p-6">
                <ul className="text-gray-600 space-y-2">
                  <li>
                    • Some PDF documents may not be fully accessible to screen
                    readers
                  </li>
                  <li>
                    • Older video content may lack captions or audio
                    descriptions
                  </li>
                  <li>
                    • Some third-party integrations may have limited
                    accessibility features
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We are actively working to address these issues and improve
                  the overall accessibility of our platform.
                </p>
              </div>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Accessibility Testing
              </h2>
              <p className="text-gray-600 mb-6">
                We regularly test our website for accessibility using a
                combination of automated tools and manual testing:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Automated Testing
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-1 ml-6">
                    <li>• WAVE Web Accessibility Evaluator</li>
                    <li>• axe DevTools</li>
                    <li>• Lighthouse Accessibility Audit</li>
                    <li>• Color Contrast Analyzers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Manual Testing
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-1 ml-6">
                    <li>• Keyboard navigation testing</li>
                    <li>• Screen reader compatibility testing</li>
                    <li>• User testing with people with disabilities</li>
                    <li>• Cross-browser accessibility testing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Feedback and Support
              </h2>
              <p className="text-gray-600 mb-6">
                We welcome your feedback on the accessibility of SkillSync.
                Please let us know if you encounter accessibility barriers or
                have suggestions for improvement.
              </p>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> accessibility@skillsync.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Innovation Drive, San
                    Francisco, CA 94105
                  </p>
                </div>
                <p className="text-gray-600 mt-4">
                  We aim to respond to accessibility feedback within 2 business
                  days.
                </p>
              </div>
            </section>

            {/* Continuous Improvement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Continuous Improvement
              </h2>
              <p className="text-gray-600 mb-4">
                We are committed to continuously improving the accessibility of
                our website. This includes:
              </p>
              <ul className="text-gray-600 space-y-2 ml-6">
                <li>• Regular accessibility audits and testing</li>
                <li>
                  • Training our development team on accessibility best
                  practices
                </li>
                <li>
                  • Incorporating accessibility requirements into our
                  development process
                </li>
                <li>
                  • Staying updated with the latest accessibility standards and
                  guidelines
                </li>
                <li>
                  • Engaging with the accessibility community for feedback and
                  guidance
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
