import { gql } from '@apollo/client';

export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      user_id
      is_blocked
    }
  }
`;