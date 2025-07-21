/**
 * Enhanced Content.js - Main landing page content container
 *
 * This component serves as the main content orchestrator for the landing page, featuring
 * modern visual design with smooth animations, better spacing, and cohesive theming.
 * Sections flow seamlessly from About Us to Top Products to Gardening Tips with
 * visual separators and enhanced user experience.
 */
import React from "react";
import Products from "./content/TopProducts";
import About from "./content/about";
import BackyardGardeningTips from '../components/gardeningInfo';

function Content() {
  return (
    <main className="bg-gradient-to-b from-white via-orange-50/30 to-green-50/20">
      {/* About Section */}
      <section className="relative">
        <About />
        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </section>

      {/* Top Products Section */}
      <section className="relative py-8">
        <Products />
        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 text-green-100 opacity-60" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path d="M0,20 Q250,0 500,20 T1000,20 L1000,40 L0,40 Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Gardening Tips Section */}
      <section className="relative bg-gradient-to-b from-green-50/30 to-white py-8">
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-8 text-green-100 opacity-60 rotate-180" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path d="M0,20 Q250,0 500,20 T1000,20 L1000,40 L0,40 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="pt-8">
          <BackyardGardeningTips />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-primary/5 via-green-500/5 to-primary/5 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Start Your Organic Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of Melbourne families who have made the switch to organic, sustainable living with SOIL's premium selection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/specials" 
              className="bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🛒 Shop Now
            </a>
            <a 
              href="/meal" 
              className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              📋 Plan Your Meals
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Content;
