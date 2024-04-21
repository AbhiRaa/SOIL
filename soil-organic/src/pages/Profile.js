import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import { findUser, deleteUser, updateUser } from "../data/users";
import EditProfileModal from '../components/EditProfileModal';
import EditPasswordModal from '../components/updatePasswordModal';

const Profile = () => {
  const { currentloggedInUser, signOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordlOpen] = useState(false);

  useEffect(() => {
    // Retrieve the user object from local storage.
    if (currentloggedInUser) {
      const userDetails = findUser(currentloggedInUser);
      if (userDetails) {
        setUser(userDetails);
        console.log(userDetails);
        } else {
          navigate("/signin"); // Redirect to sign-in page if no user data is found
        }
      } else {
        navigate("/signin"); // Redirect if not logged in
      }
  }, [currentloggedInUser, navigate]);

  const handleEdit = () => {
    // Navigate to the user edit profile modal 
    setIsEditModalOpen(true);
  };

  const handleEditPassword = () => {
    // Navigate to the edit password edit modal 
    setIsEditPasswordlOpen(true);
  };

  const handleUpdateUser = (updatedUser) => {
    updateUser(updatedUser);
    setUser(updatedUser); // Update local state
    setIsEditModalOpen(false);
    window.alert("Successfully updated the user's profile!")
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      deleteUser(currentloggedInUser);
      signOut();
      navigate("/"); // Redirect to home page after deletion
    }
  };

  const handleUpdatePassword = (newHashedPassword, userEmail) => {
    // Find the current user data to update
    const user = findUser(userEmail);
    if (!user) {
      alert('User not found.');
      return;
    }

    // Update the user's password
    const updatedUser = {
      ...user,
      password: newHashedPassword
    };

    // Update the user in local storage using the provided updateUser function
    const updateSuccess = updateUser(updatedUser);
    if (updateSuccess) {
      setUser(updatedUser); // Optionally update local state if you're tracking user info locally
      alert('Password successfully updated. Please login again!');
      setIsEditPasswordlOpen(false); // Close the modal
      signOut();
      navigate("/signin");
    } else {
        alert('Failed to update password.');
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Display a loading state while the user is null
  }

  return (
    <div className="min-h-screen bg-cyan-50">
    <Navigator />
    <div className="container bg-orange-200 rounded-lg p-3  shadow-lg mx-auto mt-10">
      
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
              <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Email address</dt>
              <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
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
                Age: {user?.profile?.age || "Not set"}<br />
                Weight: {user?.profile?.weight || "Not set"} kg<br />
                Height: {user?.profile?.height || "Not set"} cm<br />
                Gender: {user?.profile?.gender || "Not set"}<br />
                Activity Level: {user?.profile?.activityLevel || "Not set"}<br />
                Dietary Preferences: {user?.profile?.dietaryPreferences.join(", ") || "None"}<br />
                Health Goals: {user?.profile?.healthGoals.join(", ") || "None"}
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
        onClose={() => setIsEditPasswordlOpen(false)}
        onUpdatePassword={handleUpdatePassword} 
      />
      )}
    </div>
  </div>
  );
};

export default Profile;
