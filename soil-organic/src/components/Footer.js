import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

/**
 * Enhanced Footer component with comprehensive site information, links, and modern design.
 * Features company info, quick links, contact details, and social media integration.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Our Products", path: "/specials" },
    { name: "Meal Planner", path: "/meal" },
    { name: "About Us", path: "/#about-section" }
  ];

  const customerSupport = [
    { name: "Help Center", path: "/help", disabled: true },
    { name: "Contact Us", path: "/contact", disabled: true },
    { name: "Shipping Info", path: "/shipping", disabled: true },
    { name: "Returns", path: "/returns", disabled: true }
  ];

  const policies = [
    { name: "Privacy Policy", path: "/privacy", disabled: true },
    { name: "Terms of Service", path: "/terms", disabled: true },
    { name: "Cookie Policy", path: "/cookies", disabled: true },
    { name: "Sustainability", path: "/sustainability", disabled: true }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white relative z-30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="SOIL Logo" className="w-20 sm:w-24 h-15 sm:h-18 object-contain" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-400">SOIL</h3>
                <p className="text-xs sm:text-sm text-gray-300">Organic Grocer</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
              Melbourne's premier destination for premium organic food since 2001. 
              Committed to sustainable living, healthy eating, and environmental stewardship.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 justify-center sm:justify-start">
              <button 
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <span className="text-sm sm:text-lg">📘</span>
              </button>
              <button 
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <span className="text-sm sm:text-lg">📷</span>
              </button>
              <button 
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <span className="text-sm sm:text-lg">🐦</span>
              </button>
              <button 
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <span className="text-sm sm:text-lg">💼</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1">
            <h4 className="text-lg font-semibold text-green-400 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 text-sm md:text-base relative z-10 cursor-pointer"
                  >
                    <span className="text-green-500">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="sm:col-span-1">
            <h4 className="text-lg font-semibold text-green-400 mb-6">Customer Support</h4>
            <ul className="space-y-3">
              {customerSupport.map((link, index) => (
                <li key={index}>
                  {link.disabled ? (
                    <span className="text-gray-500 flex items-center gap-2 text-sm md:text-base cursor-not-allowed">
                      <span className="text-gray-600">→</span>
                      {link.name} <span className="text-xs">(Coming Soon)</span>
                    </span>
                  ) : (
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 text-sm md:text-base relative z-10 cursor-pointer"
                    >
                      <span className="text-green-500">→</span>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-green-400 mb-4 sm:mb-6">Get in Touch</h4>
            <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-green-500 mt-1 text-sm sm:text-base">📍</span>
                <div>
                  <p className="font-medium text-sm sm:text-base">Visit Our Store</p>
                  <p className="text-xs sm:text-sm">123 Collins Street<br />Melbourne VIC 3000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-green-500 mt-1 text-sm sm:text-base">📞</span>
                <div>
                  <p className="font-medium text-sm sm:text-base">Call Us</p>
                  <p className="text-xs sm:text-sm">+61 3 9123 4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-green-500 mt-1 text-sm sm:text-base">✉️</span>
                <div>
                  <p className="font-medium text-sm sm:text-base">Email Us</p>
                  <p className="text-xs sm:text-sm">hello@soilorganic.com.au</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-green-500 mt-1 text-sm sm:text-base">🕒</span>
                <div>
                  <p className="font-medium text-sm sm:text-base">Store Hours</p>
                  <p className="text-xs sm:text-sm">Mon-Fri: 7AM-8PM<br />Sat-Sun: 8AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h4 className="text-lg sm:text-xl font-semibold text-green-400 mb-3 sm:mb-4">🌱 Stay Fresh with SOIL</h4>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Get the latest organic deals, seasonal recipes, and sustainability tips delivered to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-green-500 focus:outline-none text-sm sm:text-base"
              />
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm sm:text-base text-gray-400">
                © {currentYear} SOIL Organic Grocer. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Proudly serving Melbourne's organic food community since 2001
              </p>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              {policies.map((policy, index) => (
                <span 
                  key={index}
                  className="text-gray-500 cursor-not-allowed whitespace-nowrap"
                  title="Coming Soon"
                >
                  {policy.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
