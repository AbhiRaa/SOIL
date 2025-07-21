import React, { useState, useEffect } from 'react';
import { initTips, getTips } from '../data/gardenTips';

/**
 * Enhanced BackyardGardeningTips component with modern design and rich content display
 * Features beautiful cards, detailed information, and smooth animations
 * Perfect for users interested in small-space gardening solutions
 */
function BackyardGardeningTips() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [gardeningTips, setGardeningTips] = useState([]);

  useEffect(() => {
    initTips();
    const tips = getTips();
    setGardeningTips(tips);
  }, []);

  const handleAccordionClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <span className="text-2xl">🌱</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Small Space, <span className="text-green-600">Big Harvest</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
          Don't have a huge backyard to grow your favorite vegetables?
        </p>
        <p className="text-lg text-green-600 font-medium">
          Discover these space-saving gardening techniques! 🏡
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto mt-6"></div>
      </div>

      {/* Tips Accordion */}
      <div className="space-y-6">
        {gardeningTips.map((tip, index) => (
          <div key={tip.id || index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
            {/* Accordion Header */}
            <button
              className={`w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleAccordionClick(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{tip.icon}</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600">{tip.subtitle}</p>
                  </div>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(tip.difficulty)}`}>
                    {tip.difficulty}
                  </span>
                  <div className="text-gray-400">
                    <svg 
                      className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            {/* Accordion Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 bg-gradient-to-b from-green-50/50 to-white">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Quick Info Bar */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="text-blue-600">⏱️</span>
                        <span className="text-sm font-medium text-blue-700">{tip.timeToComplete}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                        <span className="text-purple-600">🌿</span>
                        <span className="text-sm font-medium text-purple-700">Best for: {tip.bestFor?.join(', ')}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {tip.content}
                      </p>
                    </div>

                    {/* Benefits & Tips - Only show if data exists */}
                    {(tip.benefits?.length > 0 || tip.tips?.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Benefits */}
                        {tip.benefits?.length > 0 && (
                          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <span>✅</span> Key Benefits
                            </h4>
                            <ul className="space-y-2">
                              {tip.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pro Tips */}
                        {tip.tips?.length > 0 && (
                          <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                              <span>💡</span> Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {tip.tips.map((tipItem, idx) => (
                                <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">•</span>
                                  <span>{tipItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="lg:col-span-1">
                    <div className="relative rounded-xl overflow-hidden shadow-lg group">
                      <img 
                        src={tip.image} 
                        alt={`${tip.title} example`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Small-Space Garden?</h3>
          <p className="text-gray-600 mb-6">Browse our organic seeds and gardening supplies to get started!</p>
          <a 
            href="/specials" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>🛒</span>
            <span>Shop Gardening Supplies</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default BackyardGardeningTips;
