/**
 * Enhanced Content.js - Main landing page content container with dark theme
 *
 * This component serves as the main content orchestrator for the landing page, featuring
 * premium dark theme design consistent with Specials and MealPlanningApp pages.
 * Sections flow seamlessly with glass morphism effects and enhanced user experience.
 */
import React from "react";
import Products from "./content/TopProducts";
import About from "./content/about";
import BackyardGardeningTips from '../components/gardeningInfo';

function Content({ onModalStateChange }) {
  return (
    <main className="relative">
      {/* About Section */}
      <section className="relative">
        <About />
        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
      </section>

      {/* Top Products Section */}
      <section className="relative py-8">
        <Products onModalStateChange={onModalStateChange} />
        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 text-green-400/20 opacity-60" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path d="M0,20 Q250,0 500,20 T1000,20 L1000,40 L0,40 Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Gardening Tips Section */}
      <section className="relative py-8">
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-8 text-green-400/20 opacity-60 rotate-180" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path d="M0,20 Q250,0 500,20 T1000,20 L1000,40 L0,40 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="pt-8">
          <BackyardGardeningTips />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-6">
              <span className="text-2xl">🌱</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-green-400">Organic Journey</span>?
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Melbourne families who have made the switch to organic, sustainable living with SOIL's premium selection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/specials" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🛒 Shop Now
              </a>
              <a 
                href="/meal" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-green-400 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                📋 Plan Your Meals
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Content;
