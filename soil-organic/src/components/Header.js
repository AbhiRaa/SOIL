import React from "react";
import Navbar from "../components/NavigationBar";
import "../styling/header.css";

/**
 * Enhanced Header component with modern hero section design
 * Features improved typography, call-to-action buttons, and better visual hierarchy
 * with animated elements and responsive design for optimal user engagement.
 */
function Header() {
  return (
    <div className="parent-container bg-cover bg-opacity-100 relative">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Navigation */}
      <div className="relative z-100">
        <Navbar />
      </div>

      {/* Hero Content */}
      <section className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full text-center px-6">
        {/* Main Heading */}
        <div className="mb-8">
          <div className="mb-4 animate-fade-in-down">
            <span className="inline-block text-green-300 text-xl md:text-2xl font-medium mb-2">
              🌿 Premium Organic Foods
            </span>
          </div>
          <h1 className="hero-title animate-fade-in-up">
            WELCOME TO <br />
            <span className="text-green-300">SOIL</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="max-w-4xl mb-12 animate-fade-in-up animation-delay-200">
          <h2 className="hero-subtitle mb-6">
            Your favourite organic food grocer has been Melbourne's go-to destination
            for the freshest fruits and vegetables since 2001.
          </h2>
          
          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-green-300">🥬</span>
              <span>Fresh Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">🌱</span>
              <span>100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">🚚</span>
              <span>Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">🏆</span>
              <span>Award Winning</span>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-24 animate-fade-in-up animation-delay-400">
          <a 
            href="/specials" 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🛒</span>
            <span>Shop Fresh Produce</span>
          </a>
          <a 
            href="/meal" 
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>Plan Your Meals</span>
          </a>
        </div>

        {/* Scroll Indicator - Clickable */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={() => {
              const aboutSection = document.getElementById('about-section');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex flex-col items-center text-white hover:text-green-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce cursor-pointer group"
          >
            <span className="text-sm mb-1 font-medium group-hover:text-green-300 transition-colors duration-300">Discover More</span>
            <svg className="w-5 h-5 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-green-300/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-6 h-6 bg-white/20 rounded-full animate-pulse animation-delay-500"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-green-400/40 rounded-full animate-pulse animation-delay-1000"></div>
    </div>
  );
}

export default Header;
