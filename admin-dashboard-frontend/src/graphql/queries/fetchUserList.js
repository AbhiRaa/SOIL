/**
 * GraphQL query to fetch a comprehensive list of users registered in the system.
 * This query is crucial for administrative purposes where monitoring and managing user accounts is necessary.
 *
 * Returns:
 * - user_id: Unique identifier for each user, critical for distinguishing individual accounts.
 * - name: The full name of the user, useful for personalization and communication.
 * - email: User's email address, used as a primary contact method and for login identification.
 * - is_admin: Boolean flag indicating whether the user has administrative privileges.
 * - is_blocked: Boolean status showing whether the user's access to the platform is currently restricted.
 * - join_date: Date on which the user registered, useful for tracking user tenure and for historical data analysis.
 *
 * Usage:
 * This query facilitates operations such as user moderation, role assignments, and security audits.
 * Administrators can utilize this data to enforce policies, provide support, and enhance overall user governance.
 */

import { gql } from '@apollo/client';

export const FETCH_USER_LIST = gql`
  query FetchUserList {
    users {
      user_id
      name
      email
      is_admin
      is_blocked
      join_date
    }
  }
`;