import React, { useState } from 'react';

function EditProfileModal({ user, isOpen, onClose, onUpdate }) {
  // Initialize profile safely by ensuring all fields are accounted for
  const [updatedUser, setUpdatedUser] = useState({
    ...user,
    profile: {
      age: user.profile?.age || '',
      weight: user.profile?.weight || '',
      height: user.profile?.height || '',
      activityLevel: user.profile?.activityLevel || '',
      dietaryPreferences: user.profile?.dietaryPreferences || [],
      healthGoals: user.profile?.healthGoals || []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['age', 'weight', 'height'].includes(name) && value <= 0) {
      // Prevent negative and zero  values for these fields
      return;
    }
    if (['age', 'weight', 'height', 'activityLevel'].includes(name)) {
      setUpdatedUser(prev => ({
        ...prev,
        profile: { ...prev.profile, [name]: value }
      }));
    } else if (name === "name") {
      setUpdatedUser(prev => ({ ...prev, name: value }));
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {['age', 'weight', 'height'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input type="number" name={field} value={updatedUser.profile[field]} min="0" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          ))}
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">Activity Level:</label>
            <select name="activityLevel" value={updatedUser.profile.activityLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">Select Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Dietary Preferences:</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('gluten-free')} onChange={() => toggleDietaryPreference('gluten-free')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Gluten-free</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="checkbox" checked={updatedUser.profile.dietaryPreferences.includes('low-carb')} onChange={() => toggleDietaryPreference('low-carb')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Low-carb</span>
              </label>
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Health Goals:</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('weight loss')} onChange={() => toggleHealthGoal('weight loss')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Weight Loss</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('muscle gain')} onChange={() => toggleHealthGoal('muscle gain')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Muscle Gain</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="checkbox" checked={updatedUser.profile.healthGoals.includes('overall health improvement')} onChange={() => toggleHealthGoal('overall health improvement')} className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Overall Health Improvement</span>
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
