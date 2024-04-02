import React from 'react';
import Navigator from '../components/NavigationBar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    joinDate: '',
  });

  useEffect(() => {
    // Retrieve the user object from local storage.
    // It's stored under the key 'user' according to SignUp.js
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    // Format the joining date using toLocaleDateString() for a more readable format
    const formattedJoinDate = new Date(userData.joinDate).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    if (userData) {
      setUser({
        name: userData.name,
        email: userData.email,
        // Using stored join date or showing 'Not available'
        joinDate: formattedJoinDate,
      });
    } else {
      navigate('/signin'); // Redirect to sign-in page if no user data is found
    }
  }, [navigate]);

  const handleEdit = () => {
    // Navigate to the user edit page or show an edit form
    // navigate('/edit-profile');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      localStorage.removeItem('user');
      navigate('/signup'); // Redirect to sign-up page after deletion
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Join date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.joinDate}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Edit
        </button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Profile;
