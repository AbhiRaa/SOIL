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
        const newReviews = Array.isArray(data.latestReviewsFetched) ? data.latestReviewsFetched : [data.latestReviewsFetched];
        setRecentReviews(prev => [...newReviews, ...prev].slice(0, 3));
    }
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 rounded-lg p-4">
              <div className="h-4 bg-slate-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-medium">Error loading reviews: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentReviews.length > 0 ? (
        recentReviews.map((review, index) => (
          <div 
            key={review.review_id} 
            className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{review.author.name}</p>
                    <p className="text-xs text-slate-500">{review.author.email}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">on <span className="font-medium text-green-600">{review.product.product_name}</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <StarRatings
                  rating={review.rating}
                  starRatedColor="#f59e0b"
                  numberOfStars={5}
                  name={`rating-${review.review_id}`}
                  starDimension="16px"
                  starSpacing="1px"
                />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  review.is_visible 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {review.is_visible ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-slate-700 text-sm leading-relaxed">"{review.content}"</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(review.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Live
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No recent reviews</p>
          <p className="text-sm text-slate-400">New reviews will appear here automatically</p>
        </div>
      )}
    </div>
  );
};

export {
  RecentReviews as default,
};
