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
    }
  }
`;