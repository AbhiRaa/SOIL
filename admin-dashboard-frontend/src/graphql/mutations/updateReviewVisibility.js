import { gql } from '@apollo/client';

export const UPDATE_REVIEW_VISIBILITY = gql`
  mutation UpdateReviewVisibility($id: ID!, $isVisible: Boolean!) {
    updateReviewVisibility(id: $id, isVisible: $isVisible) {
      review_id
      is_visible
    }
  }
`;