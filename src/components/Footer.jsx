import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Logo */}
        <div className="text-lg font-bold">
          <span className="text-blue-400">Chat</span>App
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://x.com/pranayaranjan49" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white hover:text-blue-400 text-xl" />
          </a>
          <a href="https://github.com/Pr-Sahoo" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white hover:text-gray-400 text-xl" />
          </a>
          <a href="https://www.linkedin.com/in/pr-s-35862722b/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white hover:text-blue-600 text-xl" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
