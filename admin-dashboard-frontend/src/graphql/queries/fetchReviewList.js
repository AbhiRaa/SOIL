/**
 * GraphQL query to retrieve a detailed list of all reviews.
 * This query is integral for displaying review data in administrative panels or user interfaces,
 * enabling oversight and management of user-generated content related to products.
 *
 * Returns:
 * - review_id: Unique identifier for the review.
 * - product_id: ID of the product being reviewed, links review to specific product.
 * - user_id: ID of the user who authored the review.
 * - content: Text content of the review.
 * - rating: Numerical rating given to the product within the review.
 * - is_visible: Boolean status indicating if the review is visible to the public.
 * - created_at: Timestamp of when the review was created.
 * - updated_at: Timestamp of when the review was last updated.
 * - updated_by: Administrator's email who last updated the review.
 * - author: Nested object containing details of the reviewer (user_id, name, email).
 * - product: Nested object containing details of the reviewed product (product_id, product_name).
 *
 * Usage:
 * This query supports functions such as moderating, displaying, and analyzing reviews.
 * It is used to provide a snapshot of community engagement for products and can be 
 * utilized in data-driven decision-making processes regarding product improvements,
 * customer service interventions, and marketing strategies.
 */

import { gql } from '@apollo/client';

export const FETCH_REVIEW_LIST = gql`
  query FetchReviewList {
    reviews {
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