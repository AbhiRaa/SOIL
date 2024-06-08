import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import EditProfileModal from '../components/EditProfileModal';
import EditPasswordModal from '../components/updatePasswordModal';
import { getUserDetails, deleteUser, updateUserDetails, changeUserPassword } from "../services/userService.js";
import Footer from "../components/Footer.js";
import Notification from '../utils/notifications';

const Profile = (props) => {
  const { currentloggedInUser,  signOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [notification, setNotification] = useState(''); // State for displaying notifications

  useEffect(() => {
    // Retrieve the user object from local storage.
    async function fetchDetails() {
      if (currentloggedInUser && currentloggedInUser.userId) {
        try {
          const response = await getUserDetails(currentloggedInUser.userId);
          setUser(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          navigate("/signin"); // Redirect to sign-in on error or unauthorized
        }
      } else {
        navigate("/signin"); // Redirect if not logged in or userId is missing
      }
    }
    fetchDetails();
  }, [currentloggedInUser, navigate]);

  const handleEdit = () => {
    // Navigate to the user edit profile modal 
    setIsEditModalOpen(true);
  };

  const handleEditPassword = () => {
    // Navigate to the edit password edit modal 
    setIsEditPasswordOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await updateUserDetails(currentloggedInUser.userId, updatedUser);
      if (response.data && response.data.updatedUser) {
        setUser(response.data.updatedUser); // Update local state with the new user data
        props.updateUserContext({
          userId: response.data.updatedUser.userId,
          userName: response.data.updatedUser.userName,
          userEmail: response.data.updatedUser.userEmail
        }); // Update the context as well if username is updated
        
        setIsEditModalOpen(false);
        setNotification('Profile updated successfully!');
        setTimeout(() => setNotification(''), 3000);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setNotification('Failed to update profile. Please try again.');
      setTimeout(() => setNotification(''), 3000);
      console.error('Update Error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await deleteUser(currentloggedInUser.userId);
        signOut();
      } catch (error) {
        setNotification('Failed to delete profile.');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  const handleUpdatePassword = async (existingPassword, newPassword) => {
    if (!user) {
      setNotification('User not found.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    try {
      const response = await changeUserPassword(currentloggedInUser.userId, existingPassword, newPassword );
      if (response.status === 200) {
        setNotification('Password successfully updated. Please login again!');
        setTimeout(() => signOut(), 1000);
        setIsEditPasswordOpen(false);
        // signOut();

      } else {
        throw new Error('Failed to update password.');
      }
    } catch (error) {
    if (error.response && error.response.status === 400) {
      // Show notification when the current password is incorrect
      setNotification(error.response.data.message);
      setTimeout(() => setNotification(''), 3000);

    } else {
      // General error handling for other kinds of errors
      setNotification(error.message || "Failed to update password. Please try again!");
      setTimeout(() => setNotification(''), 3000);
    }
    console.error('Password Update Error:', error);
  }
  };

  if (!user) {
    return <div>Loading...</div>; // Display a loading state while the user is null
  }

  return (
    <div className="min-h-screen bg-cyan-50">
    <Navigator />
    <div className="container bg-orange-200 rounded-lg p-3  shadow-lg mx-auto mt-10 mb-20">
      {/* Profile Information Display Code */}  
      <div className="bg-orange-100 text-orange-500 flex-col border-2 rounded  overflow-hidden ">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center  gap-6">
            <i className="fi fi-rr-user text-3xl"></i> 
            <div>
              <h3 className="text-2xl font-bold text-primary">Profile Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">Personal details and application.</p>
            </div>
          </div> 
        </div>
        <div className="border-t border-gray-200 text-xl ">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Full name</dt>
              <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.userName}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Email address</dt>
              <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.userEmail}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Join date</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"> 
              {/* Format the joining date using toLocaleDateString() for a more readable format */}
              {new Date(user.joinDate).toLocaleDateString(("en-US",{year: "numeric", month: "long", day: "numeric", weekday: "long",}))}</dd>
            </div>
            {/* Displaying profile details */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Personal Details</dt>
              <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
                Age: {user.age || "Not set"}<br />
                Weight: {user.weight || "Not set"} kg<br />
                Height: {user.height || "Not set"} cm<br />
                Gender: {user.gender || "Not set"}<br />
                Activity Level: {user.activityLevel || "Not set"}<br />
                Dietary Preferences: {Array.isArray(user.dietaryPreferences) ? user.dietaryPreferences.join(", ") : "None"}<br />
                Health Goals: {Array.isArray(user.healthGoals) ? user.healthGoals.join(", ") : "None"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleEditPassword}>Change Password</button>
        <div>
          <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateUser}
      />
      )}

      {isEditPasswordOpen && ( // open edit Password Modal
        <EditPasswordModal
        user={user}
        isOpen={isEditPasswordOpen}
        onClose={() => setIsEditPasswordOpen(false)}
        onUpdatePassword={handleUpdatePassword} 
      />
      )}
    </div>
    {notification && <Notification message={notification} />}
    <Footer/>
  </div>
  );
}
export default Profile;
