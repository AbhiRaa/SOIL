import React, { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { LATEST_REVIEWS_FETCHED } from '../../graphql/subscriptions/latestReviewsFetched.js';
import StarRatings from 'react-star-ratings';

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
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Reviews</h2>
      {recentReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map(review => (
            <div key={review.review_id} className="border border-gray-300 rounded p-4 bg-slate-100 shadow-lg">
              <h3 className="text-lg font-semibold">
                Review by <span className="text-blue-500">{review.author.name}</span> ({review.author.email}) <br></br>on <span className="text-green-500">{review.product.product_name}</span>:
              </h3>
              <p className="text-gray-600 font-bold">{review.content}</p>
              <p className="text-sm mt-2">Rating: <span className="font-semibold mx-4"><StarRatings
                  rating={review.rating}
                  starRatedColor="orange"
                  numberOfStars={5}
                  name='rating'
                  starDimension="20px"
                  starSpacing="0.5px"
                /></span>, Visibility: <span className="font-semibold">{review.is_visible ? 'Visible' : 'Hidden'}</span></p>
              <p className="text-sm text-gray-500">Last Updated: {new Date(review.updated_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : <p>No recent reviews to display.</p>}
    </div>
  );
};

export {
  RecentReviews as default,
};
