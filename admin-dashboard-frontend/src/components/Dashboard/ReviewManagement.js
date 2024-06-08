import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Filter from 'bad-words';  // Importing bad-words
import { FETCH_REVIEW_LIST } from '../../graphql/queries/fetchReviewList';
import { UPDATE_REVIEW_VISIBILITY } from '../../graphql/mutations/updateReviewVisibility';
import additionalProfanities from '../../assets/additionalProfanities';
import StarRatings from 'react-star-ratings';

const filter = new Filter(); // Creating an instance of the filter
filter.addWords(...additionalProfanities); // Adding the custom words to the filter

const ReviewManagement = () => {
  const { data, loading, error } = useQuery(FETCH_REVIEW_LIST);
  const [errorMessage, setErrorMessage] = useState('');
  const [updateVisibility] = useMutation(UPDATE_REVIEW_VISIBILITY, {
    refetchQueries: [{ query: FETCH_REVIEW_LIST }], // Refetch reviews after update
    onError: (err) => setErrorMessage('Failed to hide/show review: ' + err.message),
    onCompleted: () => setErrorMessage('')
  });

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews :(</p>;

  const toggleVisibility = (id, isVisible) => {
    updateVisibility({ variables: { id, isVisible: !isVisible } });
  };

  const isProfane = (text) => filter.isProfane(text); // Check for profanity

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Review Management</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <table className="min-w-full table-auto bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Author</th>
            <th className="py-3 px-6 text-left">Review</th>
            <th className="py-3 px-6 text-center">Rating</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-md font-semibold">
          {data && data.reviews.map(review => (
            <tr key={review.review_id} className={`border-b border-gray-200 hover:bg-gray-100 ${isProfane(review.content) ? 'bg-red-100' : ''}`}>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {review.author.name} ({review.author.email})
              </td>
              <td className="py-3 px-6 text-left">
                {review.content}
              </td>
              <td className="py-3 px-6 text-center">
                <StarRatings
                  rating={review.rating}
                  starRatedColor="orange"
                  numberOfStars={5}
                  name='rating'
                  starDimension="20px"
                  starSpacing="2px"
                />
              </td>
              <td className="py-3 px-6 text-center">
                {isProfane(review.content) && <span className="text-red-500 font-medium">Flagged for moderation</span>}
                <button onClick={() => toggleVisibility(review.review_id, review.is_visible)} className={`ml-4 px-4 py-1 rounded ${review.is_visible ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold`}>
                  {review.is_visible ? 'Hide' : 'Show'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewManagement;
