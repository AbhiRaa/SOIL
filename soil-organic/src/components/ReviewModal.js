import React, { useState, useEffect, useRef, useContext } from "react";
import StarRatings from "react-star-ratings";
import AddReviewModal from "./AddReviewModal";
import UserContext from "../hooks/context";
import { addReview } from "../services/reviewService";
// import ReplyComponent from "./replyComponent";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { FaReply } from "react-icons/fa";
import { fetchReviews, updateReview, addReply, fetchReplies, deleteReview} from "../services/reviewService";
import { followUser, fetchFollowing, unfollowUser } from "../services/userService";
import Notification from '../utils/notifications';

function ReviewModal({ product, onClose, updateReviewCounts, updateAverageRatings }) {
  const { currentloggedInUser } = useContext(UserContext);
  const [isAddEditReviewModalOpen, setIsAddEditReviewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingReviews, setExistingReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const reviewsRef = useRef(null);
  const [expandedReviewId, setExpandedReviewId] = useState(null); // to expand reviews to see replies
  const [replies, setReplies] = useState([]); //
  const [followingUsers, setFollowingUsers] = useState([]);
  const [notification, setNotification] = useState(''); // State for displaying notifications

  // Simple background scroll prevention
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleNotificationCycle = (review) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 5) {
        setNotification(`Your review on ${product.product_name} has been deleted by the admin.`);
        setTimeout(() => setNotification(''), 1000);  // Show the notification for 1 second
        count++;
      } else {
        clearInterval(interval); // Stop the interval after 5 cycles
        deleteReview(review.review_id).then(() => {
          setExistingReviews(currentReviews => currentReviews.filter(r => r.review_id !== review.review_id));
          console.log(`Review ${review.review_id} deleted after 5 notifications`);

          // Reset the states
          setReviewToEdit(null);
          setIsEditMode(false); // Reset edit mode
          // Display a notification message
          setNotification('You review is hidden permanently, contact support at admin@soil.com.');
          setTimeout(() => setNotification(''), 3000);

        }).catch(error => console.error("Failed to delete review", error));
      }
    }, 1500);  // Interval of 1.5 seconds for each cycle of notification
  };

  // Simulate fetching existing reviews for the product
  useEffect(() => {
    const fetchReviewsforProduct= async(product)=>{
      try {
        const response = await fetchReviews(product.product_id);
        const reviews = response.data.reviews.filter(review => review.is_visible || review.user_id === currentloggedInUser.userId);
        const filteredReviews = reviews.map(review => ({
          review_id: review.review_id,
          userId: review.user_id,
          rating: review.rating,
          content: review.content,
          userName: review.author.name,
          productId: review.product_id,
          created_at: review.created_at,
        }));
        setExistingReviews(filteredReviews);

        // Handle notifications for non-visible/hidden reviews for currentloggedInUser - MODERATED BY ADMIN.
        reviews.forEach(review => {
          if (!review.is_visible && review.user_id === currentloggedInUser.userId) {
            handleNotificationCycle(review);
          }
        });

        // Check if current user has already reviewed
        const userReview = filteredReviews.find(r => r.userId === currentloggedInUser.userId);
        console.log(userReview)
        if (userReview) {
          setIsEditMode(true);
          setReviewToEdit(userReview);
        }

      } catch (error) {
          if (error.response && error.response.status === 404) {
            // Handle the 'no reviews' case without logging as an error
            setNotification("No reviews found for this product");
            setTimeout(() => setNotification(''), 3000);
            setExistingReviews([]);  // Ensure no reviews are set in state
          } else {
            // Handle other types of errors more severely
            console.error("Failed to fetch reviews", error);
            setNotification("Error fetching reviews");
            setTimeout(() => setNotification(''), 3000);
          }
        }
    }
    fetchReviewsforProduct(product);


    // Simulate fetching following users
    // const fetchedFollowingUsers = [1]; // Example: assuming the user is following user with ID 1
    const fetchFollowingList = async()=>{
      try{
        const response = await fetchFollowing(currentloggedInUser.userId)
        const followingList = response.data.followingIds
        console.log(followingList)
        setFollowingUsers(followingList);
      }catch(error){
        console.log("failed to ffetch followers",error)
      }
    }
    fetchFollowingList();

  }, [product, currentloggedInUser.userId, handleNotificationCycle]);

  const handleReviewButton = () => {
    setIsAddEditReviewModalOpen(true);
    if (!isEditMode) {
      // Prepare to add a new review
      setReviewToEdit(null);
    }
  };

  const toggleReplySection = (reviewId) => {
    console.log(reviewId)
    const fetchAllReplies = async(reviewId)=>{
      try{
        const response = await fetchReplies(reviewId)
        const allReplies  = response.data.replies
        console.log(allReplies)
        setReplies(allReplies);
      }
      catch (error) {
        console.error("Failed to fetch replies", error);
        // Optionally handle error state in UI
      }
    }
    if (expandedReviewId !== reviewId) {
      setExpandedReviewId(reviewId);

      fetchAllReplies(reviewId)
    }
  };

  const closeReplySection = () => {
    setExpandedReviewId(null);
  };

  const recalculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return reviews.length ? totalRating / reviews.length : 0;
  };

  const handleAddReply = async (reviewId, replyText) => {
    // const newReply = { user: "Current User", text: replyText };
    // setReplies([...replies, newReply]);
    // Optionally, make an API call here to save the reply to the backend

    try {
      console.log(reviewId)
      console.log(currentloggedInUser.userId)
      const reply = {
          user_id: currentloggedInUser.userId, // Assuming you have user_id in the context
          content: replyText,
      };
      console.log(reply)
      const response = await addReply(reviewId, reply);
      const result = response.data.reply
      result.userName = currentloggedInUser.userName
      console.log(result)

      // Assuming the backend returns the added reply, you append it to the correct review.
      setReplies(prevReplies => [...prevReplies, result]);
    } catch (error) {
        console.error('Error adding reply:', error.message);
    }
  };

  const handleReviewSubmission = async (newReview) => {
    try {
      //adding the product_id to the review before api call
      // newReview["product_id"] = product.product_id;
      if(isEditMode){
        console.log(reviewToEdit.reviewId)
      }
    
      let response
      if (isEditMode && reviewToEdit) {
        response = await updateReview(newReview);  // Assuming updateReview is an API method you have
        setNotification('Your review has been updated successfully!');
        setTimeout(() => setNotification(''), 3000);
        
      } else {
        // Add new review
        response = await addReview(newReview);
        setNotification('Your review has been added successfully!');
        setTimeout(() => setNotification(''), 3000);
      }
      // Extracting the full review data including the author details from the response
      const reviewResponse  = response.data.review;
      console.log(reviewResponse)

      
      // Assuming response.data contains the updated or new review
      const updatedReviewList = isEditMode ?
      existingReviews.map(review => review.review_id === reviewResponse.review_id ? {...review,
        content: reviewResponse.content,
        rating: reviewResponse.rating
      } : review) :
      [...existingReviews, {
        userName: reviewResponse.author.name, // Display the author's name
        userId: reviewResponse.user_id,
        review_id: reviewResponse.review_id, // This should match the property name used in your component state
        rating: reviewResponse.rating,
        content: reviewResponse.content,
        author: reviewResponse.author,// You might store the whole author object if needed elsewhere
        created_at: reviewResponse.created_at,
      }];
      console.log(updatedReviewList)

      setExistingReviews(updatedReviewList)
      console.log("review response after review is",response.data.review  )
      setReviewToEdit(response.data.review);
      setIsEditMode(true);
      console.log("reviewToEdit after add is",reviewToEdit)
      setIsAddEditReviewModalOpen(false);

      // Update the review count in ProductList
      updateReviewCounts(product.product_id, updatedReviewList.length);

      // Calculate and update the average rating
      const newAverageRating = recalculateAverageRating(updatedReviewList);
      updateAverageRatings(product.product_id, newAverageRating);
      
    } catch (error) {
      console.error("Failed to add/update reviews", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteReview(reviewId)
      if(response.status === 201) {
        const updatedReviews = existingReviews.filter(
          (review) => review.review_id !== reviewId
        );
        setExistingReviews(updatedReviews);

        // Check if the deleted review was the user's review
        if (reviewToEdit && reviewId === reviewToEdit.review_id) {
          setReviewToEdit(null);
          setIsEditMode(false); // Reset edit mode
        }
        // Optionally, display a notification message
        setNotification('Review deleted successfully.');
        setTimeout(() => setNotification(''), 3000);

        // Update the Avg review in ProductList
        const newAverageRating = recalculateAverageRating(updatedReviews);
        updateAverageRatings(product.product_id, newAverageRating);

        // Update the count in ProductList
        updateReviewCounts(product.product_id, updatedReviews.length);
      } else {
        throw new Error(`Couldn't delete review`)
      }
    } catch(error){
      console.error("Failed to delete review", error);
    }
  };

  const handleFollowUser = async (userId,reviewerName) => {
    
    if (followingUsers.includes(userId)) {
      // Unfollow logic
      try{
        const response = await unfollowUser(currentloggedInUser.userId, userId)
        if(response.status === 201){
          setFollowingUsers(followingUsers.filter(id => id !== userId));
          setNotification(`Successfully unfollowed ${reviewerName}`);
          setTimeout(() => setNotification(''), 3000);
        }
        else{
          throw new Error("couldn't follow user")
        }
      }catch (error) {
        console.error("Failed to follow/unfollow", error);
      }
      setFollowingUsers(followingUsers.filter(id => id !== userId));
      console.log(`Unfollowed user with ID: ${userId}`);
    } else {
      // Follow logic
      try{
        const response = await followUser(currentloggedInUser.userId, userId)
        if(response.status === 201){
          setFollowingUsers([...followingUsers, userId]);
          setNotification(`Successfully followed ${reviewerName}`);
          setTimeout(() => setNotification(''), 3000);
        }
        else{
          throw new Error("couldn't follow user")
        }
      }catch (error) {
        console.error("Failed to follow/unfollow", error);
      }
      console.log(`Following user with ID: ${userId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {/* Premium Backdrop with Enhanced Blur */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300"></div>
      
      {/* Premium Centered Modal */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Modal Content Container */}
            <div className="relative flex flex-col flex-1 min-h-0">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-xl group z-10"
              >
                <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Modal Header */}
              <div className="relative p-8 pr-20 border-b border-white/20 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6 flex-1 mr-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20">
                        <img
                          src={"http://localhost:4000/"+product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {product.is_special && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          Special
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {product.product_name}
                      </h2>
                      <p className="text-gray-400">Customer Reviews & Ratings</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleReviewButton}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                    >
                      <span>⭐</span>
                      <span>{isEditMode ? "Edit Review" : "Add Review"}</span>
                    </button>
                  </div>
                </div>
                
                {/* Scroll Indicator */}
                {existingReviews.length > 3 && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      <span>↓</span>
                      <span>Scroll to see more reviews</span>
                      <span>↓</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Modal Body - Scrollable Reviews */}
              <div 
                className="flex-1 overflow-y-auto min-h-0 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
                }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <span className="text-xl">💬</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">User Reviews</h3>
                      <p className="text-gray-400 text-sm">{existingReviews.length} review{existingReviews.length !== 1 ? 's' : ''} for this product</p>
                    </div>
                  </div>
                  
                  <div ref={reviewsRef} className="space-y-6">
                    {existingReviews.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📝</span>
                        </div>
                        <p className="text-gray-300 text-lg mb-4">No reviews available.</p>
                        <p className="text-gray-400 text-sm">Be the first to share your experience with this product!</p>
                      </div>
                    ) :
                      existingReviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                        >
                          {/* Review Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center border border-white/20">
                                <span className="text-lg text-white">{review.userName.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-bold text-white text-lg">{review.userName}</p>
                                <p className="text-gray-400 text-sm">{formatDate(review.created_at)}</p>
                              </div>
                            </div> 
                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              {currentloggedInUser &&
                                currentloggedInUser.userId !== review.userId && (
                                  <button
                                    onClick={() => handleFollowUser(review.userId, review.userName)}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                      followingUsers.includes(review.userId)
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                    }`}
                                    title={followingUsers.includes(review.userId) ? 'Unfollow' : 'Follow'}
                                  >
                                    {followingUsers.includes(review.userId) ? (
                                      <SlUserFollowing size={18} />
                                    ) : (
                                      <SlUserFollow size={18} />
                                    )}
                                  </button>
                                )}
                              
                              <button
                                onClick={() => toggleReplySection(review.review_id)}
                                className="p-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white rounded-lg transition-all duration-200"
                                title="Reply to review"
                              >
                                <FaReply size={18} />
                              </button>
                              
                              {currentloggedInUser &&
                                currentloggedInUser.userId === review.userId && (
                                  <button
                                    onClick={() => handleDeleteReview(review.review_id)}
                                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg transition-all duration-200"
                                    title="Delete review"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                            </div>
                          </div>
                          
                          {/* Rating */}
                          <div className="mb-3">
                            <StarRatings
                              name={`rating-${review.review_id}`}
                              rating={review.rating}
                              starCount={5}
                              starRatedColor="#fbbf24"
                              editing={false}
                              starDimension="18px"
                              starSpacing="2px"
                            />
                          </div>
                          
                          {/* Review Content */}
                          <p className="text-gray-300 leading-relaxed">{review.content}</p>
                          {/* Replies Section */}
                          {expandedReviewId === review.review_id && (
                            <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                  <span className="text-sm">💬</span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">Replies ({replies.length})</h4>
                              </div>
                              
                              {replies.length > 0 && (
                                <div className="space-y-4 mb-6">
                                  {replies.map((reply) => (
                                    <div key={reply.reply_id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full flex items-center justify-center border border-white/20">
                                          <span className="text-xs text-white">{reply.userName?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                        <p className="font-bold text-white text-sm">{reply.userName}</p>
                                      </div>
                                      <p className="text-gray-300 text-sm pl-11">{reply.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Reply Form */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const replyText = e.target.elements.replyText.value;
                                  handleAddReply(review.review_id, replyText);
                                  e.target.reset();
                                }}
                                className="space-y-4"
                              >
                                <input
                                  type="text"
                                  name="replyText"
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                                  placeholder="Add a thoughtful reply..."
                                  required
                                  maxLength={1000}
                                />
                                <div className="flex gap-3">
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                                  >
                                    <span>📝</span>
                                    <span>Reply</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={closeReplySection}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
                                  >
                                    Close
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Review Modal */}
      {isAddEditReviewModalOpen && (
        <AddReviewModal
          product={product}
          existingReview={reviewToEdit}
          onClose={() => setIsAddEditReviewModalOpen(false)}
          onSubmit={handleReviewSubmission}
          isEditMode={isEditMode}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification} 
          type={
            notification.includes('Error') || notification.includes('hidden') ? 'error' :
            notification.includes('deleted') || notification.includes('admin') ? 'warning' :
            'success'
          }
        />
      )}
    </>
  );
}

export default ReviewModal;
