import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_USER_LIST } from '../../graphql/queries/fetchUserList';
import { BLOCK_USER } from '../../graphql/mutations/blockUser';
import { UNBLOCK_USER } from '../../graphql/mutations/unblockUser';

const UserManagement = () => {
  const { loading, error, data } = useQuery(FETCH_USER_LIST);
  const [errorMessage, setErrorMessage] = useState('');

  const [blockUser] = useMutation(BLOCK_USER, {
    refetchQueries: [ { query: FETCH_USER_LIST }],
    onError: (err) => setErrorMessage('Failed to block user: ' + err.message),
    onCompleted: () => setErrorMessage('')
  });

  const [unblockUser] = useMutation(UNBLOCK_USER, {
    refetchQueries: [ { query: FETCH_USER_LIST }],
    onError: (err) => setErrorMessage('Failed to unblock user: ' + err.message),
    onCompleted: () => setErrorMessage('')
  });
  
  const formatDate = (timestamp) => {
    // Convert the string timestamp to a number and create a new Date object
    const date = new Date(Number(timestamp));
    return date.toLocaleString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users :(</p>;

  return (
    <div>
      <h1>User Management</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {data && data.users.map((user) => (
        <div key={user.user_id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <p>
            <strong>Name:</strong> {user.name} <br />
            <strong>Email:</strong> {user.email} <br />
            <strong>Status:</strong> {user.is_blocked ? 'Blocked' : 'Active'} <br />
            <strong>Join Date:</strong> {formatDate(user.join_date)}
          </p>
          <button onClick={() => blockUser({ variables: { id: user.user_id } }).catch(e => {})}>
            Block
          </button>
          <button onClick={() => unblockUser({ variables: { id: user.user_id } }).catch(e => {})}>
            Unblock
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;