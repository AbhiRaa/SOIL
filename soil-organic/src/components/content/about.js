/**
 * Enhanced About.js - Modern About Us section with dark theme
 * 
 * Features premium dark theme design with glass morphism effects,
 * enhanced typography, and interactive elements that match the
 * consistent design language across all pages.
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-6">
          <span className="text-2xl">🌿</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          About <span className="text-green-400">SOIL</span>
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-8"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Column */}
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg text-gray-300 leading-relaxed">
              <p className="text-xl mb-6">
                Welcome to <span className="font-semibold text-green-400">SOIL</span>, your premier destination for premium organic food in Melbourne.
              </p>
              <p className="mb-6">
                At SOIL, we believe in more than just providing nourishment for the body; we're dedicated to cultivating a community centered around <span className="font-medium text-green-400">sustainable living</span>, <span className="font-medium text-green-400">healthy eating</span>, and <span className="font-medium text-green-400">mindful consumption</span>.
              </p>
              <p>
                With a rich history rooted in a passion for organic farming and a commitment to environmental stewardship, SOIL stands as a beacon of freshness and quality in Melbourne's bustling food market.
              </p>
            </div>
          </div>

          {/* Mission Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
              <h4 className="font-semibold text-green-400 mb-2">🌱 Sustainable</h4>
              <p className="text-sm text-gray-300">Committed to eco-friendly farming practices</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
              <h4 className="font-semibold text-blue-400 mb-2">🥬 Fresh</h4>
              <p className="text-sm text-gray-300">Locally sourced, premium quality produce</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300">
              <h4 className="font-semibold text-orange-400 mb-2">👥 Community</h4>
              <p className="text-sm text-gray-300">Building healthy eating communities</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
              <h4 className="font-semibold text-purple-400 mb-2">🎯 Quality</h4>
              <p className="text-sm text-gray-300">Rigorous quality standards & certification</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
            <img 
              src={aboutus} 
              alt="SOIL organic food collection showcasing fresh fruits and vegetables"
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-green-400/20 rounded-full opacity-60 backdrop-blur-sm"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-400/20 rounded-full opacity-60 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-green-400/30 rounded-full opacity-60 backdrop-blur-sm"></div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="mt-16 text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <blockquote className="relative">
            <div className="text-4xl text-green-400/30 absolute -top-6 left-1/2 transform -translate-x-1/2">"</div>
            <p className="text-xl md:text-2xl font-medium text-gray-200 italic max-w-4xl mx-auto leading-relaxed">
              "We don't just sell organic food - we nurture a lifestyle that honors both our bodies and our planet."
            </p>
            <footer className="mt-6 text-green-400 font-semibold">
              — The SOIL Team
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default About;
