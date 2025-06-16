import React from "react";
import {
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Zap,
  Code,
  Database,
  Palette,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About SkillSync
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A full-stack job portal project showcasing modern web development
              skills with AI-powered job matching and career development tools.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold">React</div>
                <div>Frontend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Node.js</div>
                <div>Backend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">MongoDB</div>
                <div>Database</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Project Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              To demonstrate comprehensive full-stack development skills by
              creating a modern job portal that leverages artificial
              intelligence for intelligent job matching and career development.
            </p>
            <p className="text-lg text-gray-600">
              This project showcases proficiency in React, Node.js, MongoDB, and
              various modern web technologies while solving real-world problems
              in the job search and recruitment space.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Target className="w-16 h-16 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Project Vision
            </h3>
            <p className="text-gray-600">
              To create a comprehensive, production-ready job portal that
              demonstrates advanced web development capabilities, modern UI/UX
              design principles, and integration of AI-powered features for
              enhanced user experience.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Development Principles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guided the development of this project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Clean Code
              </h3>
              <p className="text-gray-600">
                Writing maintainable, well-documented code that follows best
                practices and industry standards for scalability and
                collaboration.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Performance
              </h3>
              <p className="text-gray-600">
                Optimizing for speed and efficiency while maintaining excellent
                user experience across all devices and network conditions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                User Experience
              </h3>
              <p className="text-gray-600">
                Creating intuitive, accessible, and beautiful interfaces that
                prioritize user needs and provide seamless interactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Developer</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the developer behind this comprehensive full-stack project.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Aryan Majithia
            </h3>
            <p className="text-blue-600 mb-4 text-lg">Full-Stack Developer</p>
            <p className="text-gray-600 mb-6">
              Passionate developer with expertise in modern web technologies
              including React, Node.js, MongoDB, and various frontend
              frameworks. This project demonstrates comprehensive full-stack
              development capabilities and problem-solving skills.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <strong>Frontend:</strong> React, Tailwind CSS, Vite
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <strong>Backend:</strong> Node.js, Express, MongoDB
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Story */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Project Story</h2>
              <p className="text-lg text-gray-300 mb-6">
                SkillSync was developed as a comprehensive portfolio project to
                showcase full-stack development skills. The goal was to create a
                production-ready job portal that demonstrates proficiency in
                modern web technologies and problem-solving abilities.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                This project incorporates advanced features like AI-powered job
                matching, resume analysis, real-time messaging, and
                comprehensive user management systems. It serves as a testament
                to the ability to build complex, scalable web applications from
                concept to deployment.
              </p>
              <p className="text-lg text-gray-300">
                The development process involved extensive research, careful
                planning, and iterative improvements to ensure a polished,
                professional result that demonstrates both technical competence
                and attention to detail.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded mr-3"></span>
                  AI-powered job matching and recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded mr-3"></span>
                  Resume analysis with ATS scoring
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded mr-3"></span>
                  Real-time messaging and notifications
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded mr-3"></span>
                  Comprehensive user dashboard and profile management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded mr-3"></span>
                  Responsive design with modern UI/UX
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technologies Used
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This project leverages a modern tech stack to deliver a robust and
            scalable solution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Frontend</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• React 18 with Hooks</li>
              <li>• Tailwind CSS for styling</li>
              <li>• React Router for navigation</li>
              <li>• Axios for API communication</li>
              <li>• Lucide React for icons</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Backend</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Node.js with Express</li>
              <li>• MongoDB with Mongoose</li>
              <li>• JWT for authentication</li>
              <li>• bcrypt for password hashing</li>
              <li>• CORS and security middleware</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Palette className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                Tools & Deployment
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Vite for build tooling</li>
              <li>• Git for version control</li>
              <li>• ESLint for code quality</li>
              <li>• Responsive design principles</li>
              <li>• Modern development practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
