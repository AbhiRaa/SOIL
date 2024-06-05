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