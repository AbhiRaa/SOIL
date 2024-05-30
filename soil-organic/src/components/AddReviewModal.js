// src/components/AddReviewModal.jsx

import React, { useState,useContext } from 'react';
import StarRatings from 'react-star-ratings';
import UserContext from "../hooks/context";

function AddReviewModal({ product, existingReview, onClose, onSubmit }) {
    const [review, setReview] = useState(existingReview ? existingReview.review : '');
    const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
    const { currentloggedInUser } = useContext(UserContext);  // Context to access the currently logged-in user
  
    const handleSubmit = () => {
      if (currentloggedInUser) {
        // Create the review object including the user information
        const newReview = {
          user: currentloggedInUser,  // Assuming the user context has a 'name' property
          rating,
          review,
        };
  
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
          <p className="font-bold mb-2">{currentloggedInUser ? `${currentloggedInUser}'s Review` : "Your Review"}</p>
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={changeRating}
            numberOfStars={5}
            name='rating'
            starDimension="30px"
            starSpacing="5px"
          />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full h-32 p-2 border rounded mt-4"
            placeholder="Write your review here..."
          />
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
