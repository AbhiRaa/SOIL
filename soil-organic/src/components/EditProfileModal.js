import React, { useState } from 'react';

/**
 * EditProfileModal component provides a user interface for editing user profile details.
 * It allows users to update their personal information including dietary preferences and health goals.
 * 
 * Props:
 * - user: The current user object whose profile is to be edited.
 * - isOpen: A boolean that controls the visibility of the modal.
 * - onClose: A function to call when closing the modal.
 * - onUpdate: A function to call when the user submits the updated profile.
 */
function EditProfileModal({ user, isOpen, onClose, onUpdate }) {
  // Initialize profile safely by ensuring all fields are accounted for
  const [updatedUser, setUpdatedUser] = useState({
    ...user,
    profile: {
      age: user.profile?.age || '',
      weight: user.profile?.weight || '',
      height: user.profile?.height || '',
      gender: user.profile?.gender || '',
      activityLevel: user.profile?.activityLevel || '',
      dietaryPreferences: user.profile?.dietaryPreferences || [],
      healthGoals: user.profile?.healthGoals || []
    }
  });

  // Function to handle changes to input fields and update state accordingly.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['age', 'weight', 'height'].includes(name) && value <= 0) {
      // Prevent negative and zero  values for these fields
      return;
    }
    if (['age', 'weight', 'height', 'gender', 'activityLevel'].includes(name)) {
      // Update state for the profile fields.
      setUpdatedUser(prev => ({
        ...prev,
        profile: { ...prev.profile, [name]: value }
      }));
    } else if (name === "name") {
      // Update state for the name field.
      setUpdatedUser(prev => ({ ...prev, name: value }));
    }
  };

  // Function to toggle dietary preferences in the user's profile.
  const toggleDietaryPreference = (preference) => {
    setUpdatedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        dietaryPreferences: prev.profile.dietaryPreferences.includes(preference) ?
          prev.profile.dietaryPreferences.filter(p => p !== preference) :
          [...prev.profile.dietaryPreferences, preference]
      }
    }));
  };

  // Function to toggle health goals in the user's profile.
  const toggleHealthGoal = (goal) => {
    setUpdatedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        healthGoals: prev.profile.healthGoals.includes(goal) ?
          prev.profile.healthGoals.filter(g => g !== goal) :
          [...prev.profile.healthGoals, goal]
      }
    }));
  };

  // Function to handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedUser);
    onClose();  // Close the modal after successful update.
  };

  if (!isOpen) return null; // Don't render the modal if it's not open.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl text-primary font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-primary">Name:</label>
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {['age', 'weight', 'height'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-lg font-medium text-primary">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input type="number" name={field} value={updatedUser.profile[field]} min="0" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          ))}
          <div>
            <label htmlFor="activityLevel" className="block text-lg font-medium text-primary">Activity Level:</label>
            <select name="activityLevel" value={updatedUser.profile.activityLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="sedentary">Sedentary</option>
              <option value="lightly active">Lightly active</option>
              <option value="moderately active">Moderately active</option>
              <option value="very active">Very active</option>
              <option value="super active">Super active</option>
            </select>
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
            <select name="gender" value={updatedUser.profile.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">Select Level</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <span className="block text-lg font-medium text-primary">Dietary Preferences:</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('gluten free')} onChange={() => toggleDietaryPreference('gluten free')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Gluten free</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('ketogenic')} onChange={() => toggleDietaryPreference('ketogenic')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Ketogenic</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('vegetarian')} onChange={() => toggleDietaryPreference('vegetarian')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Vegetarian</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('vegan')} onChange={() => toggleDietaryPreference('vegan')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Vegan</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('whole30')} onChange={() => toggleDietaryPreference('whole30')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Whole30</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('pescetarian')} onChange={() => toggleDietaryPreference('pescetarian')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Pescetarian</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('paleo')} onChange={() => toggleDietaryPreference('paleo')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Paleo</span>
              </label>
            </div>
          </div>
          <div>
            <span className="block font-medium text-primary text-lg">Health Goals:</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('weight loss')} onChange={() => toggleHealthGoal('weight loss')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Weight Loss</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('muscle gain')} onChange={() => toggleHealthGoal('muscle gain')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary text-lg">Muscle Gain</span>
              </label>
              <label className="inline-flex items-center text-lg">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('overall health improvement')} onChange={() => toggleHealthGoal('overall health improvement')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-primary">Overall Health Improvement</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Profile</button>
            <button onClick={onClose} className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
