// src/components/EditReviewModal.jsx

import React, { useState, useContext } from 'react';
import StarRatings from 'react-star-ratings';
import UserContext from "../hooks/context";

function EditReviewModal({ product, review, onClose, onSubmit }) {
  const [editedReview, setEditedReview] = useState(review.review);
  const [editedRating, setEditedRating] = useState(review.rating);
  const { currentloggedInUser } = useContext(UserContext);

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Your Review</h2>
        <p className="font-bold mb-2">{currentloggedInUser ? `${currentloggedInUser}'s Review` : "Your Review"}</p>
        <StarRatings
          rating={editedRating}
          starRatedColor="gold"
          changeRating={changeRating}
          numberOfStars={5}
          name='rating'
          starDimension="30px"
          starSpacing="5px"
        />
        <textarea
          value={editedReview}
          onChange={(e) => setEditedReview(e.target.value)}
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
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditReviewModal;
