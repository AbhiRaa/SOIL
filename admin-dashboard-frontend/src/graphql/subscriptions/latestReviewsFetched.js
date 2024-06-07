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
