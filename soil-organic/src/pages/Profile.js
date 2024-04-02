import React from 'react';
import Navigator from '../components/NavigationBar';

function Profile() {
  return (
    <div style={{ margin: '20px 5%' }}>
      <Navigator />
      <h1>Profile</h1>
      <p>Welcome to your profile! Here you can view and edit your details.</p>
      {/* User details and edit/delete options will go here */}
    </div>
  );
}

export default Profile;
