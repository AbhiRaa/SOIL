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
