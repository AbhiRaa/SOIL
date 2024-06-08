/**
 * GraphQL subscription for receiving updates on product engagement.
 * This subscription provides real-time updates on engagement metrics for products,
 * including review count and average rating. This can help in monitoring product performance
 * and customer satisfaction in real-time.
 *
 * Fields:
 * - product_id: Unique identifier of the product.
 * - product_name: Name of the product.
 * - is_special: Boolean indicating if the product is marked as special (e.g., for promotions).
 * - reviewsAggregate:
 *   - count: Total number of reviews received for the product.
 *   - averageRating: Average rating of all reviews for the product, calculated on-the-fly.
 *
 * Usage:
 * This subscription is particularly useful for visual dashboards where real-time
 * product feedback is crucial for making quick decisions regarding promotions, stock adjustments,
 * or further marketing strategies.
 */

import { gql } from '@apollo/client';

export const PRODUCT_ENGAGEMENT_UPDATED = gql`
  subscription ProductEngagementUpdated {
    productEngagementUpdated {
      product_id
      product_name
      is_special
      reviewsAggregate {
        count
        averageRating
      }
    }
  }
`;
