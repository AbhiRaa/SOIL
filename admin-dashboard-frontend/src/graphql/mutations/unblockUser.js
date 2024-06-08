/**
 * GraphQL mutation for unblocking a previously blocked user in the system.
 * This mutation allows administrators to restore access to users who were previously
 * restricted due to policy review administrative actions.
 *
 * Mutation Input:
 * - $id: The unique identifier of the user to be unblocked.
 *
 * Returns:
 * - user_id: Unique identifier of the user being unblocked.
 * - is_blocked: Boolean indicating the current blocked status of the user (false after unblocking).
 *
 * Usage:
 * This mutation is used in the user management section of the admin dashboard,
 * allowing administrators to manage user access and maintain compliance with platform policies.
 *
 * Example:
 * An administrator reviews a user's appeal against a block, finds the user's arguments reasonable,
 * and decides to unblock the user, reinstating their access to the platform.
 */

import { gql } from '@apollo/client';

export const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id) {
      user_id
      is_blocked
    }
  }
`;