// src/components/EditReviewModal.jsx

import React, { useState, useContext, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import UserContext from "../hooks/context";

function EditReviewModal({ product, review, onClose, onSubmit }) {
  const [editedReview, setEditedReview] = useState(review.review);
  const [editedRating, setEditedRating] = useState(review.rating);
  const { currentloggedInUser } = useContext(UserContext);

  // Simple background scroll prevention
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSubmit = () => {
    if (currentloggedInUser) {
      const updatedReview = {
        ...review,
        rating: editedRating,
        review: editedReview,
      };

      onSubmit(updatedReview);
      setEditedReview('');
      setEditedRating(0);
      onClose();
    } else {
      console.log("No user logged in");
    }
  };

  const changeRating = (newRating) => {
    setEditedRating(newRating);
  };

  return (
    <>
      {/* Premium Backdrop with Enhanced Blur */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[110] transition-all duration-300"></div>
      
      {/* Premium Centered Modal */}
      <div className="fixed inset-0 z-[111] overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-xl group z-10"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Modal Header */}
            <div className="relative p-8 border-b border-white/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-2xl">✏️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Edit Your Review</h2>
                  <p className="text-gray-400">{currentloggedInUser ? `${currentloggedInUser.userName}'s Review` : "Update your experience"}</p>
                </div>
              </div>
            </div>
            {/* Modal Body */}
            <div className="relative p-8 space-y-6">
              
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your Rating
                </label>
                <div className="flex items-center gap-4">
                  <StarRatings
                    rating={editedRating}
                    starRatedColor="#fbbf24"
                    starHoverColor="#fbbf24"
                    changeRating={changeRating}
                    numberOfStars={5}
                    name='rating'
                    starDimension="32px"
                    starSpacing="4px"
                  />
                  <span className="text-gray-400 text-sm">
                    {editedRating === 0 ? 'Select rating' : `${editedRating} out of 5 stars`}
                  </span>
                </div>
              </div>
              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your Review
                </label>
                <textarea
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  maxLength={1000}
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 resize-none"
                  placeholder="Update your experience with this product..."
                />
                <div className="flex justify-end mt-2">
                  <span className="text-gray-400 text-xs">
                    {editedReview.length}/1000 characters
                  </span>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="relative border-t border-white/20 p-8 bg-gradient-to-r from-white/5 to-white/10 rounded-b-3xl">
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <span>💾</span>
                  <span>Update Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditReviewModal;
