import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">SkillSync</h3>
            <p className="text-gray-400 mb-4">
              A comprehensive full-stack job portal project by Aryan Majithia,
              showcasing modern web development skills with AI-powered features.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/post-job"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Project</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">aryanmajithia786@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">+91 6280185197</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">Remote / Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SkillSync. A project by Aryan Majithia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
