import React, { useState, useEffect } from 'react';

/**
 * Enhanced EditProfileModal with Premium Centered Design
 * Features a sophisticated centered modal with multi-column layout and premium styling
 */
function EditProfileModal({ user, isOpen, onClose, onUpdate }) {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  // Simple background scroll prevention
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the background
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

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
    { value: 'overall health improvement', label: 'Overall Health', icon: '🎯' }
  ];

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'preferences', label: 'Preferences', icon: '🥗' },
    { id: 'goals', label: 'Health Goals', icon: '🎯' }
  ];

  return (
    <>
      {/* Premium Backdrop with Enhanced Blur - Highest z-index to cover everything */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300" onClick={onClose}></div>
      
      {/* Premium Centered Modal - Higher z-index than backdrop */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className={`relative w-full max-w-6xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-8 border-b border-white/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-2xl">✏️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Edit Profile</h2>
                  <p className="text-gray-400">Update your personal information and preferences</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-xl group"
              >
                <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="relative flex border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                    activeSection === section.id
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <span className="hidden sm:inline">{section.label}</span>
                  </div>
                  {activeSection === section.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Modal Body - Premium Layout */}
            <div className="relative max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
              <form onSubmit={handleSubmit} className="p-8">
                
                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
                    </div>
                    
                    {/* Name Field - Full Width */}
                    <div className="max-w-2xl mx-auto">
                      <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-3">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        name="userName" 
                        value={updatedUser.userName || ''} 
                        onChange={handleChange}
                        className={`w-full px-6 py-4 bg-white/10 border ${errors.userName ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 text-lg`}
                        placeholder="Enter your full name"
                      />
                      {errors.userName && (
                        <p className="mt-2 text-sm text-red-400">{errors.userName}</p>
                      )}
                    </div>

                    {/* Multi-Column Grid for Physical Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-3">Age</label>
                        <input 
                          type="number" 
                          name="age" 
                          value={updatedUser.age || ''} 
                          min="0" 
                          max="120"
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/10 border ${errors.age ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                          placeholder="Age"
                        />
                        {errors.age && <p className="mt-1 text-xs text-red-400">{errors.age}</p>}
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-3">Weight (kg)</label>
                        <input 
                          type="number" 
                          name="weight" 
                          value={updatedUser.weight || ''} 
                          min="0" 
                          max="500"
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/10 border ${errors.weight ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                          placeholder="Weight"
                        />
                        {errors.weight && <p className="mt-1 text-xs text-red-400">{errors.weight}</p>}
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-3">Height (cm)</label>
                        <input 
                          type="number" 
                          name="height" 
                          value={updatedUser.height || ''} 
                          min="0" 
                          max="300"
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/10 border ${errors.height ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                          placeholder="Height"
                        />
                        {errors.height && <p className="mt-1 text-xs text-red-400">{errors.height}</p>}
                      </div>
                    </div>

                    {/* Gender and Activity Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-3">Gender</label>
                        <select 
                          name="gender" 
                          value={updatedUser.gender || ''} 
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-gray-800 text-gray-300">Select Gender</option>
                          <option value="male" className="bg-gray-800 text-white">Male</option>
                          <option value="female" className="bg-gray-800 text-white">Female</option>
                          <option value="other" className="bg-gray-800 text-white">Other</option>
                          <option value="prefer not to say" className="bg-gray-800 text-white">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-3">Activity Level</label>
                        <select 
                          name="activityLevel" 
                          value={updatedUser.activityLevel || ''} 
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
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
                )}

                {/* Dietary Preferences Section */}
                {activeSection === 'preferences' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Dietary Preferences</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
                      <p className="text-gray-400 mt-3">Select all that apply to your dietary lifestyle</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                      {dietaryOptions.map(option => (
                        <label 
                          key={option.value}
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            updatedUser.dietaryPreferences?.includes(option.value)
                              ? 'bg-green-400/20 border-green-400/50 text-green-400 shadow-lg shadow-green-400/20'
                              : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={updatedUser.dietaryPreferences?.includes(option.value) || false} 
                            onChange={() => toggleDietaryPreference(option.value)}
                            className="sr-only"
                          />
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <span className="text-xl">
                            {updatedUser.dietaryPreferences?.includes(option.value) ? '✅' : '⭕'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Goals Section */}
                {activeSection === 'goals' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Health Goals</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
                      <p className="text-gray-400 mt-3">Choose your primary health and wellness objectives</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                      {healthGoalOptions.map(option => (
                        <label 
                          key={option.value}
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            updatedUser.healthGoals?.includes(option.value)
                              ? 'bg-blue-400/20 border-blue-400/50 text-blue-400 shadow-lg shadow-blue-400/20'
                              : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={updatedUser.healthGoals?.includes(option.value) || false} 
                            onChange={() => toggleHealthGoal(option.value)}
                            className="sr-only"
                          />
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <span className="text-xl">
                            {updatedUser.healthGoals?.includes(option.value) ? '✅' : '⭕'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Modal Footer */}
            <div className="relative border-t border-white/20 p-8 bg-gradient-to-r from-white/5 to-white/10 rounded-b-3xl">
              <div className="flex justify-end gap-4 max-w-md ml-auto">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfileModal;