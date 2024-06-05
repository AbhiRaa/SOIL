import { gql } from '@apollo/client';

export const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id) {
      user_id
      is_blocked
    }
  }
`;