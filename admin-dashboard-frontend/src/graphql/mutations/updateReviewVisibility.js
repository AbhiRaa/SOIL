/**
 * GraphQL mutation for updating the visibility status of a review.
 * This operation allows administrators to toggle the visibility of reviews on the platform,
 * making them visible or hidden to other users. This can be crucial for managing inappropriate
 * or sensitive content.
 *
 * Mutation Input:
 * - $id: The unique identifier of the review whose visibility is to be updated.
 * - $isVisible: A Boolean value indicating the desired visibility state (true for visible, false for hidden).
 *
 * Returns:
 * - review_id: The ID of the review that was updated.
 * - is_visible: The new visibility state of the review after the mutation.
 *
 * Usage:
 * This mutation is used in the review management section of the admin dashboard,
 * where administrators can control the content displayed to users to ensure it adheres to
 * community guidelines and platform standards.
 *
 * Example:
 * If a review contains sensitive content that might not be appropriate for all users,
 * an admin can set its visibility to false to hide it from the public view, directly affecting
 * what content is accessible to users browsing product reviews.
 */

import { gql } from '@apollo/client';

export const UPDATE_REVIEW_VISIBILITY = gql`
  mutation UpdateReviewVisibility($id: ID!, $isVisible: Boolean!) {
    updateReviewVisibility(id: $id, isVisible: $isVisible) {
      review_id
      is_visible
    }
  }
`;