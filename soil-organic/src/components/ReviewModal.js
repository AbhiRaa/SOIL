import React, { useState, useEffect, useRef, useContext } from "react";
import StarRatings from "react-star-ratings";
import AddReviewModal from "./AddReviewModal";
import UserContext from "../hooks/context";
import EditReviewModal from "./EditReviewModal";
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

  }, [product, currentloggedInUser.userId]);

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 ">
      <div className="p-6 rounded shadow-lg w-2/3 relative bg-orange-100 text-orange-600 text-xl h-[80vh] overflow-y-scroll">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-1000 hover:text-gray-800 text-4xl "
        >
          &times;
        </button>
        <div className="flex justify-between items-center mb-4 mt-3 p-2">
          <div className="flex items-center space-x-3 align-middle">
            <img
              src={"http://localhost:4000/"+product.product_image}
              alt={product.product_name}
              className="w-20 h-20 object-cover rounded mr-4"
            />
            <h2 className="text-4xl font-bold space-x-2">
              {product.product_name}
            </h2>
            {product.is_special && (
              <span className="text-white font-bold bg-green-500 rounded-md p-1">
                Special
              </span>
            )}
          </div>
          <button
            onClick={handleReviewButton}
            className="bg-teal-500 text-white px-2 py-1 rounded text-xl"
          >
            {isEditMode ? "Edit Review" : "Add Review"}
          </button>
        </div>
        <div className="mt-4">
          <div className="mx-4">
            <h3 className="text-3xl font-bold">User Reviews</h3>
          </div>
          <div ref={reviewsRef} className="mt-2   px-5">
          {existingReviews.length === 0 ? (
            <p className="text-center text-lg mt-4">No reviews available.</p>
          ) :
            existingReviews.map((review) => (
              <div
                key={review.review_id}
                className=" border-b py-2 flex-col justify-between items-start border-black"
              >
                <div className="userreviewRatingDiv">
                  <div className="userratingNameDiv">
                    <div className="flex space-x-9 items-end">
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-2xl">{review.userName}</p>
                        <p className="createdAt font-thin  text-sm">{formatDate(review.created_at)}</p>
                      </div> 
                      <div className="text-lg space-x-5 items-center flex justify-between">
                        {currentloggedInUser &&
                          currentloggedInUser.userId !== review.userId && (
                            <>
                              <button
                                onClick={() => handleFollowUser(review.userId,review.userName)}
                                className="text-slate-500 underline text-sm mb-1"
                              >
                                {followingUsers.includes(review.userId) ? ( // conditional  rendering to show different buttons depending on followed or want to unfollow
                                  <SlUserFollowing size={22} />
                                ) : (
                                  <SlUserFollow size={22} />
                                )}
                              </button>
                            </>
                              )}
                            <>
                              <button
                              onClick={() => toggleReplySection(review.review_id)}
                              className="text-slate-500 underline text-sm mt-1"
                              >
                              <FaReply  size={23}/>
                              </button>
                            </>
                          
                        <div className="text-lg space-x-5 items-center">
                          {currentloggedInUser &&
                            currentloggedInUser.userId === review.userId && (
                              <>
                                {/* <button
                                  onClick={() =>
                                    handleOpenEditReviewModal(review)
                                  }
                                  className="underline text-sm mb-1 text-slate-500 mr-2 p-2"
                                >
                                  Edit
                                </button> */}
                                <button
                                  onClick={() => handleDeleteReview(review.review_id)}
                                  className="text-red-500 underline text-sm"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          
                        </div>
                      </div>
                    </div>
                    <StarRatings
                      name={`rating-${review.review_id}`}
                      rating={review.rating}
                      starCount={5}
                      starRatedColor="gold"
                      editing={false}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                  </div>
                  <p>{review.content}</p>
                </div>
                {expandedReviewId === review.review_id && (
                  <div className="mt-2 w-full bg-gray-100 p-3 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">Replies</h4>
                    {replies.map((reply) => (
                      <div key={reply.reply_id} className="border-b py-2">
                        <p className="font-bold">{reply.userName}</p>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const replyText = e.target.elements.replyText.value;
                        handleAddReply(review.review_id, replyText);
                        e.target.reset();
                      }}
                      className="mt-4"
                    >
                      <input
                        type="text"
                        name="replyText"
                        className="border p-2 rounded w-full"
                        placeholder="Add a reply under 100 words"
                        required
                        maxLength={1000}
                      />
                      <div className="flex gap-10">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                          Reply
                        </button>
                        <button
                        onClick={closeReplySection}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
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
      {isAddEditReviewModalOpen && (
        <AddReviewModal
          product={product}
          existingReview={reviewToEdit}
          onClose={() => setIsAddEditReviewModalOpen(false)}
          onSubmit={handleReviewSubmission}
          isEditMode={isEditMode}
        />
      )}
      {notification && <Notification message={notification} />}
      {/* {isEditReviewModalOpen && reviewToEdit && (
        <EditReviewModal
          product={product}
          review={reviewToEdit}
          onClose={handleCloseEditReviewModal}
          onSubmit={handleEditReview}
        />
      )} */}
    </div>
  );
}

export default ReviewModal;
