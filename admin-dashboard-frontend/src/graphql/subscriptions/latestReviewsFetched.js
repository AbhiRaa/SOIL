/**
 * GraphQL subscription for fetching the latest reviews.
 * This subscription listens for any new or updated reviews and retrieves full details about those reviews,
 * including related user (author) and product data.
 * 
 * Fields:
 * - review_id: Unique identifier for the review.
 * - product_id: ID of the product associated with the review.
 * - user_id: ID of the user who wrote the review.
 * - content: Text content of the review.
 * - rating: Numerical rating given in the review.
 * - is_visible: Boolean indicating if the review is visible to other users.
 * - created_at: Timestamp of when the review was created.
 * - updated_at: Timestamp of when the review was last updated.
 * - updated_by: Identifier of the admin who last updated the review.
 * - author: Embedded object containing details of the user who authored the review.
 * - product: Embedded object containing details of the product related to the review.
 * 
 * This subscription can be used to maintain a real-time feed of review activities for monitoring or display
 * in an administrative dashboard.
 */

import { gql } from '@apollo/client';

export const LATEST_REVIEWS_FETCHED = gql`
  subscription LatestReviewsFetched {
    latestReviewsFetched {
      review_id
      product_id
      user_id
      content
      rating
      is_visible
      created_at
      updated_at
      updated_by
      author {
        user_id
        name
        email
      }
      product {
        product_id
        product_name
      }
    }
  }
`;
