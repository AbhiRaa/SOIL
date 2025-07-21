/**
 * Enhanced About.js - Modern About Us section
 * 
 * Features a visually appealing two-column layout with enhanced typography,
 * better spacing, and interactive elements. Includes mission highlights,
 * statistics, and improved visual hierarchy for better user engagement.
 */

import React from "react";
import aboutus from "../../images/aboutUs-collage.jpg";

function About() {
  const stats = [
    { number: "2001", label: "Est. Year" },
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Organic Products" }
  ];

  return (
    <section id="about-section" className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <span className="text-xl">🌿</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          About <span className="text-primary">SOIL</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-500 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Column */}
        <div className="space-y-8">
          <div className="prose prose-lg text-gray-700 leading-relaxed">
            <p className="text-xl mb-6">
              Welcome to <span className="font-semibold text-primary">SOIL</span>, your premier destination for premium organic food in Melbourne.
            </p>
            <p className="mb-6">
              At SOIL, we believe in more than just providing nourishment for the body; we're dedicated to cultivating a community centered around <span className="font-medium text-green-600">sustainable living</span>, <span className="font-medium text-green-600">healthy eating</span>, and <span className="font-medium text-green-600">mindful consumption</span>.
            </p>
            <p>
              With a rich history rooted in a passion for organic farming and a commitment to environmental stewardship, SOIL stands as a beacon of freshness and quality in Melbourne's bustling food market.
            </p>
          </div>

          {/* Mission Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Sustainable</h4>
              <p className="text-sm text-green-700">Committed to eco-friendly farming practices</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">🥬 Fresh</h4>
              <p className="text-sm text-blue-700">Locally sourced, premium quality produce</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-800 mb-2">👥 Community</h4>
              <p className="text-sm text-orange-700">Building healthy eating communities</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 Quality</h4>
              <p className="text-sm text-purple-700">Rigorous quality standards & certification</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6 py-6 border-t border-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={aboutus} 
              alt="SOIL organic food collection showcasing fresh fruits and vegetables"
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay gradient for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-green-100 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-100 rounded-full opacity-60"></div>
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-primary/20 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="mt-16 text-center">
        <blockquote className="relative">
          <div className="text-4xl text-primary/20 absolute -top-6 left-1/2 transform -translate-x-1/2">"</div>
          <p className="text-xl md:text-2xl font-medium text-gray-700 italic max-w-4xl mx-auto">
            "We don't just sell organic food - we nurture a lifestyle that honors both our bodies and our planet."
          </p>
          <footer className="mt-4 text-primary font-semibold">
            — The SOIL Team
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

export default About;
