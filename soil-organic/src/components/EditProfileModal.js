import React, { useState } from 'react';

/**
 * Enhanced EditProfileModal with Dark Theme
 * Features premium dark theme design that blends seamlessly with the Profile page
 */
function EditProfileModal({ user, isOpen, onClose, onUpdate }) {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [errors, setErrors] = useState({});

  // Function to handle changes to input fields and update state accordingly.
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate numeric fields
    if (['age', 'weight', 'height'].includes(name)) {
      const numValue = parseInt(value);
      if (name === 'age' && (numValue < 0 || numValue > 120)) {
        setErrors(prev => ({ ...prev, age: 'Age must be between 0 and 120' }));
        return;
      }
      if (name === 'weight' && (numValue < 0 || numValue > 500)) {
        setErrors(prev => ({ ...prev, weight: 'Weight must be between 0 and 500' }));
        return;
      }
      if (name === 'height' && (numValue < 0 || numValue > 300)) {
        setErrors(prev => ({ ...prev, height: 'Height must be between 0 and 300' }));
        return;
      }
      // Clear error if valid
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update the field
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle dietary preferences in the user's profile
  const toggleDietaryPreference = (preference) => {
    setUpdatedUser(prev => {
      const currentPreferences = Array.isArray(prev.dietaryPreferences) ? prev.dietaryPreferences : [];
      const isExisting = currentPreferences.includes(preference);
      const newPreferences = isExisting
        ? currentPreferences.filter(p => p !== preference)
        : [...currentPreferences, preference];
      return { ...prev, dietaryPreferences: newPreferences };
    });
  };

  // Toggle health goals in the user's profile
  const toggleHealthGoal = (goal) => {
    setUpdatedUser(prev => {
      const currentGoals = Array.isArray(prev.healthGoals) ? prev.healthGoals : [];
      const isExisting = currentGoals.includes(goal);
      const newGoals = isExisting
        ? currentGoals.filter(g => g !== goal)
        : [...currentGoals, goal];
      return { ...prev, healthGoals: newGoals };
    });
  };

  // Function to handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!updatedUser.userName?.trim()) {
      setErrors(prev => ({ ...prev, userName: 'Name is required' }));
      return;
    }
    
    console.log("Submitting Updated User:", updatedUser);
    onUpdate(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  // Dietary preference options
  const dietaryOptions = [
    { value: 'gluten free', label: 'Gluten Free', icon: '🌾' },
    { value: 'ketogenic', label: 'Ketogenic', icon: '🥑' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'whole30', label: 'Whole30', icon: '🍎' },
    { value: 'pescetarian', label: 'Pescetarian', icon: '🐟' },
    { value: 'paleo', label: 'Paleo', icon: '🥩' }
  ];

  // Health goal options
  const healthGoalOptions = [
    { value: 'weight loss', label: 'Weight Loss', icon: '📉' },
    { value: 'muscle gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'overall health improvement', label: 'Overall Health', icon: '🎯' },
    { value: 'energy boost', label: 'Energy Boost', icon: '⚡' },
    { value: 'better sleep', label: 'Better Sleep', icon: '😴' },
    { value: 'stress reduction', label: 'Stress Reduction', icon: '🧘' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-white/10 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✏️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-green-400">📝</span> Basic Information
            </h3>
            
            {/* Name Field */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                name="userName" 
                value={updatedUser.userName || ''} 
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${errors.userName ? 'border-red-400/50' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                placeholder="Enter your full name"
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-400">{errors.userName}</p>
              )}
            </div>

            {/* Age, Weight, Height Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input 
                  type="number" 
                  name="age" 
                  value={updatedUser.age || ''} 
                  min="0" 
                  max="120"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.age ? 'border-red-400/50' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                  placeholder="Age"
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-red-400">{errors.age}</p>
                )}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input 
                  type="number" 
                  name="weight" 
                  value={updatedUser.weight || ''} 
                  min="0" 
                  max="500"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.weight ? 'border-red-400/50' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                  placeholder="Weight"
                />
                {errors.weight && (
                  <p className="mt-1 text-xs text-red-400">{errors.weight}</p>
                )}
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                  Height (cm)
                </label>
                <input 
                  type="number" 
                  name="height" 
                  value={updatedUser.height || ''} 
                  min="0" 
                  max="300"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.height ? 'border-red-400/50' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                  placeholder="Height"
                />
                {errors.height && (
                  <p className="mt-1 text-xs text-red-400">{errors.height}</p>
                )}
              </div>
            </div>

            {/* Gender and Activity Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select 
                  name="gender" 
                  value={updatedUser.gender || ''} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select Gender</option>
                  <option value="male" className="bg-gray-800 text-white">Male</option>
                  <option value="female" className="bg-gray-800 text-white">Female</option>
                  <option value="other" className="bg-gray-800 text-white">Other</option>
                  <option value="prefer not to say" className="bg-gray-800 text-white">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-2">
                  Activity Level
                </label>
                <select 
                  name="activityLevel" 
                  value={updatedUser.activityLevel || ''} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select Level</option>
                  <option value="sedentary" className="bg-gray-800 text-white">Sedentary</option>
                  <option value="lightly active" className="bg-gray-800 text-white">Lightly Active</option>
                  <option value="moderately active" className="bg-gray-800 text-white">Moderately Active</option>
                  <option value="very active" className="bg-gray-800 text-white">Very Active</option>
                  <option value="super active" className="bg-gray-800 text-white">Super Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dietary Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-green-400">🥗</span> Dietary Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dietaryOptions.map(option => (
                <label 
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    updatedUser.dietaryPreferences?.includes(option.value)
                      ? 'bg-green-400/20 border-green-400/50 text-green-400'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={updatedUser.dietaryPreferences?.includes(option.value) || false} 
                    onChange={() => toggleDietaryPreference(option.value)}
                    className="sr-only"
                  />
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                  <span className="ml-auto">
                    {updatedUser.dietaryPreferences?.includes(option.value) ? '✅' : '⭕'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Health Goals Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-green-400">🎯</span> Health Goals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {healthGoalOptions.map(option => (
                <label 
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    updatedUser.healthGoals?.includes(option.value)
                      ? 'bg-blue-400/20 border-blue-400/50 text-blue-400'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={updatedUser.healthGoals?.includes(option.value) || false} 
                    onChange={() => toggleHealthGoal(option.value)}
                    className="sr-only"
                  />
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                  <span className="ml-auto">
                    {updatedUser.healthGoals?.includes(option.value) ? '✅' : '⭕'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;