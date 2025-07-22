// src/components/AddReviewModal.jsx

import React, { useState, useContext, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import UserContext from "../hooks/context";

function AddReviewModal({ product, existingReview, onClose, onSubmit }) {
    const [review, setReview] = useState(existingReview ? existingReview.content : '');
    const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
    const { currentloggedInUser } = useContext(UserContext);  // Context to access the currently logged-in user
    const [errors, setErrors] = useState({});  // State to hold error messages

    // Simple background scroll prevention
    useEffect(() => {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, []);
  
    const handleSubmit = () => {
      let errorMessages = {};
      // Validate review content
      if (!review.trim()) {
        errorMessages.review = "Review content is required.";
      }

      // Validate rating
      if (rating === 0) {
        errorMessages.rating = "Please select a rating.";
      }

      if (Object.keys(errorMessages).length > 0) {
        setErrors(errorMessages);
        return;  // Stop the submission if there are errors
      }


      if (currentloggedInUser) {
        // Create the review object including the user information
        console.log(review)
        const newReview = {
          product_id:product.product_id,
          user_id: currentloggedInUser.userId,  // Assuming the user context has a 'name' property
          rating,
          content:review,
        };
        
        // Only add review_id if it's an update operation
        if (existingReview && existingReview.review_id) {
          newReview.reviewId = existingReview.review_id;
        }

        // Submit the review (e.g., save it to the database or state)
        onSubmit(newReview);
  
        // Clear the form
        setReview('');
        setRating(0);
        onClose();
      } else {
        console.log("No user logged in");
      }
    };
  
    const changeRating = (newRating) => {
      if (newRating > 0) {
        setErrors(prev => ({ ...prev, rating: null }));  // Clear rating error if a valid rating is selected
      }
      setRating(newRating);
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
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{existingReview ? "Edit Your Review" : "Add Your Review"}</h2>
                    <p className="text-gray-400">{currentloggedInUser.userName ? `${currentloggedInUser.userName}'s Review` : "Share your experience"}</p>
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
                      rating={rating}
                      starRatedColor="#fbbf24"
                      starHoverColor="#fbbf24"
                      changeRating={changeRating}
                      numberOfStars={5}
                      name='rating'
                      starDimension="32px"
                      starSpacing="4px"
                    />
                    <span className="text-gray-400 text-sm">
                      {rating === 0 ? 'Select rating' : `${rating} out of 5 stars`}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.rating}
                    </p>
                  )}
                </div>
                {/* Review Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => {
                      setReview(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, review: null }));
                      }
                    }}
                    maxLength={1000}
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 resize-none"
                    placeholder="Share your experience with this product..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.review && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.review}
                      </p>
                    )}
                    <span className="text-gray-400 text-xs ml-auto">
                      {review.length}/1000 characters
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
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  >
                    <span>📝</span>
                    <span>{existingReview ? "Update Review" : "Submit Review"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default AddReviewModal;
