import React, { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { LATEST_REVIEWS_FETCHED } from '../../graphql/subscriptions/latestReviewsFetched.js';

const RecentReviews = () => {
  const [recentReviews, setRecentReviews] = useState([]);
  const { data, loading, error } = useSubscription(LATEST_REVIEWS_FETCHED, {
    onError: err => console.error("Subscription error:", err)
  });

  // Update recent reviews when new data is published
  useEffect(() => {
    if (data && data.latestReviewsFetched) {
        console.log("Subscription data received:", data);
        // Ensure that the data.latestReviewsFetched is an array and handle accordingly
        const newReviews = Array.isArray(data.latestReviewsFetched) ? data.latestReviewsFetched : [data.latestReviewsFetched];
        setRecentReviews(prev => [...newReviews, ...prev].slice(0, 3));
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Recent Reviews</h2>
      {recentReviews.length > 0 ? (
        <ul>
          {recentReviews.map(review => (
            <li key={review.review_id}>
              {/* <p><strong>Review by User ID {review.user_id} on Product ID {review.product_id}:</strong></p> */}
              <p><strong>Review by {review.author.name} : {review.author.email} on {review.product.product_name}:</strong></p>
              <p>{review.content}</p>
              <p>Rating: {review.rating}, Visibility: {review.is_visible ? 'Visible' : 'Hidden'}</p>
              <p>Last Updated: {new Date(review.updated_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : <p>No recent reviews to display.</p>}
    </div>
  );
};

export {
  RecentReviews as default,
};
