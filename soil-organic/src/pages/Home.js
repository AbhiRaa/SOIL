import React, { useState } from "react";
import Header from "../components/Header";
import Content from "../components/content";
import Footer from "../components/Footer";

/**
 * Enhanced Home page with consistent dark theme design
 * Matches the premium aesthetic of Specials and MealPlanningApp pages
 */
function Home(Props) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
      
      {/* Content Sections */}
      <div className="relative z-20">
        {!isReviewModalOpen && <Header />}
        <Content onModalStateChange={setIsReviewModalOpen} />
        {!isReviewModalOpen && <Footer />}
      </div>
    </div>
  );
}

export default Home;
