// src/components/ReviewModal.jsx

import React, { useState, useEffect, useRef , useContext} from 'react';
import StarRatings from 'react-star-ratings';
import AddReviewModal from './AddReviewModal';
import UserContext from "../hooks/context";
import EditReviewModal from './EditReviewModal';

function ReviewModal({ product, onClose }) {
    const { currentloggedInUser } = useContext(UserContext);
    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
    const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
    const [existingReviews, setExistingReviews] = useState([]);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const reviewsRef = useRef(null);

  // Simulate fetching existing reviews for the product
  useEffect(() => {
    // This should be replaced with actual data fetching logic
    const fetchedReviews = [
      { id: 1, user: 'John Doe', rating: 4, review: 'Great product!' },
      { id: 2, user: 'Jane Smith', rating: 5, review: 'Absolutely love it!' },
      // Add more reviews here to test scrolling
    ];
    setExistingReviews(fetchedReviews);
  }, [product]);

  const handleOpenAddReviewModal = () => {
    setIsAddReviewModalOpen(true);
  };

  const handleCloseAddReviewModal = () => {
    setIsAddReviewModalOpen(false);
  };

  const handleOpenEditReviewModal = (review) => {
    setReviewToEdit(review);
    setIsEditReviewModalOpen(true);
  };

  const handleCloseEditReviewModal = () => {
    setIsEditReviewModalOpen(false);
    setReviewToEdit(null);
  };

  const handleAddReview = (newReview) => {
    // Add the new review to the existing reviews
    setExistingReviews([...existingReviews, newReview]);
  };

  const handleEditReview = (updatedReview) => {
    const updatedReviews = existingReviews.map(review =>
      review.id === updatedReview.id ? updatedReview : review
    );
    setExistingReviews(updatedReviews);
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = existingReviews.filter(review => review.id !== reviewId);
    setExistingReviews(updatedReviews);
  };

  const handleFollowUser = (userId) => {
    console.log(`Following user with ID: ${userId}`);
    // Add follow logic here
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3 align-middle">
            <img src={product.product_image} alt={product.product_name} className="w-16 h-16 object-cover rounded mr-4" />
            <h2 className="text-xl font-bold space-x-2">{product.product_name}</h2>
            {product.is_special && <span className="text-white font-bold bg-green-500 rounded-md p-1">Special</span>}
          </div>
          <button
            onClick={handleOpenAddReviewModal}
            className="bg-teal-500 text-white px-2 py-1 rounded text-sm"
          >
            Add Review
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">User Reviews</h3>
          <div ref={reviewsRef} className="mt-2 h-64 overflow-y-scroll">
            {existingReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-300 py-2 flex justify-between items-start">
                <div>
                  <div className='flex space-x-9 items-center'>
                    <p className="font-bold">{review.user}</p>
                    <div className="text-lg space-x-5 items-center">
                    {currentloggedInUser && currentloggedInUser!== review.user && (
                      <button
                        onClick={() => handleFollowUser(review.userId)}
                        className="text-slate-500 underline text-sm mb-1"
                      >
                        Follow
                      </button>
                    )}
                    </div>
                  </div>
                  <StarRatings
                    name={`rating-${review.id}`}
                    rating={review.rating}
                    starCount={5}
                    starRatedColor="gold"
                    editing={false}
                    starDimension="20px"
                    starSpacing="2px"
                  />
                  
                  <p>{review.review}</p>
                </div>
                <div className="text-lg space-x-5 items-center">
                  
                  {currentloggedInUser && currentloggedInUser === review.user && (
                    <>
                      <button
                        onClick={() => handleOpenEditReviewModal(review)}
                        className="underline text-sm mb-1 text-slate-500 mr-2 p-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 underline text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button className="text-slate-500 underline text-sm mt-1">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isAddReviewModalOpen && (
        <AddReviewModal
          product={product}
          onClose={handleCloseAddReviewModal}
          onSubmit={handleAddReview}
        />
      )}
      {isEditReviewModalOpen && reviewToEdit && (
        <EditReviewModal
          product={product}
          review={reviewToEdit}
          onClose={handleCloseEditReviewModal}
          onSubmit={handleEditReview}
        />
      )}
    </div>
  );
}

export default ReviewModal;
