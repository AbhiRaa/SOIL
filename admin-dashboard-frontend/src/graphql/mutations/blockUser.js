/**
 * GraphQL mutation to block a user in the database.
 * This mutation is crucial for administrating user activity, particularly in moderating reviews on SOIL.
 *
 * Mutation Input:
 * - $id: The unique identifier of the user to be blocked.
 *
 * Returns:
 * - user_id: The unique identifier of the user who has been blocked.
 * - is_blocked: A boolean flag confirming the user is now blocked.
 *
 * Usage:
 * This mutation can be triggered from administrative dashboard where user activities require moderation or restriction.
 * It provides admins the ability to block accound to login.
 *
 * Example:
 * The mutation might be used in a user management dashboard where administrators can quickly disable a user's account.
 */

import { gql } from '@apollo/client';

export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      user_id
      is_blocked
    }
  }
`;