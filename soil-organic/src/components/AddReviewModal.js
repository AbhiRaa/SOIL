// src/components/AddReviewModal.jsx

import React, { useState,useContext } from 'react';
import StarRatings from 'react-star-ratings';
import UserContext from "../hooks/context";

function AddReviewModal({ product, existingReview, onClose, onSubmit }) {
    const [review, setReview] = useState(existingReview ? existingReview.content : '');
    const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
    const { currentloggedInUser } = useContext(UserContext);  // Context to access the currently logged-in user
    const [errors, setErrors] = useState({});  // State to hold error messages
  
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
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">{existingReview ? "Edit Your Review" : "Add Your Review"}</h2>
          <p className="font-bold mb-2">{currentloggedInUser.userName ? `${currentloggedInUser.userName}'s Review` : "Your Review"}</p>
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={changeRating}
            numberOfStars={5}
            name='rating'
            starDimension="30px"
            starSpacing="5px"
          />
          {errors.rating && <p className="text-red-500">{errors.rating}</p>}
          <textarea
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, review: null }));  // Clear review error if valid content is provided
              }
            }}
            className="w-full h-32 p-2 border rounded mt-4"
            placeholder="Write your review here..."
          />
          {errors.review && <p className="text-red-500">{errors.review}</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-teal-500 text-white px-4 py-2 rounded"
            >
              {existingReview ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default AddReviewModal;
