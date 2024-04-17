import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import { findUser, deleteUser, updateUser } from "../data/users";
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { currentloggedInUser, signOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleUpdateUser = (updatedUser) => {
    updateUser(updatedUser);
    setUser(updatedUser); // Update local state
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      deleteUser(currentloggedInUser);
      signOut();
      navigate("/"); // Redirect to home page after deletion
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Display a loading state while the user is null
  }

  return (
    <div className="container mx-auto mt-10">
      <Navigator />
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
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"> 
              {/* Format the joining date using toLocaleDateString() for a more readable format */}
              {new Date(user.joinDate).toLocaleDateString(("en-US",{year: "numeric", month: "long", day: "numeric", weekday: "long",}))}</dd>
            </div>
            {/* Displaying profile details */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Profile Details</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Age: {user?.profile?.age || "Not set"}<br />
                Weight: {user?.profile?.weight || "Not set"} kg<br />
                Height: {user?.profile?.height || "Not set"} cm<br />
                Activity Level: {user?.profile?.activityLevel || "Not set"}<br />
                Dietary Preferences: {user?.profile?.dietaryPreferences.join(", ") || "None"}<br />
                Health Goals: {user?.profile?.healthGoals.join(", ") || "None"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateUser}
      />
      )}
    </div>
  );
};

export default Profile;
