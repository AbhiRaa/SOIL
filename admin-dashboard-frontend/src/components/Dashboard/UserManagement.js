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
  if (error) return <p>Error loading users :</p>;

  return (
    <div className='h-[90vh] '>
    <div className='container mx-auto px-4 h-full'>
      <h1 className='text-2xl font-bold my-4  p-4'>User Management</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="overflow-auto h-[80vh]">
        <table className="w-full text-left rounded-lg shadow overflow-hidden">
          <thead className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 text-md font-semibold'>
            {data && data.users.map((user) => (
              <tr key={user.user_id} className="border-b">
                <td className="px-4 py-2">{user.user_id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.is_blocked ? 'Blocked' : 'Active'}</td>
                <td className="px-4 py-2">{formatDate(user.join_date)}</td>
                <td className="px-4 py-2">
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2" 
                          onClick={() => blockUser({ variables: { id: user.user_id } }).catch(e => {})}>
                    Block
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                          onClick={() => unblockUser({ variables: { id: user.user_id } }).catch(e => {})}>
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default UserManagement;