import React, { useState, useEffect } from 'react';
import { isStrongPassword } from "../utils/validation.js";

/**
 * Enhanced ChangePasswordModal with Premium Design & Password Strength Indicator
 * Features a sophisticated centered modal matching the app's dark theme
 */
function ChangePasswordModal({ user, isOpen, onClose, onUpdatePassword }) {
  // State to hold password inputs and error messages
  const [passwords, setPasswords] = useState({
    existingPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    existing: false,
    new: false,
    confirm: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  // Simple background scroll prevention
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Password strength evaluation
  const evaluatePasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    const score = Object.values(criteria).filter(Boolean).length;
    let feedback = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        color = 'text-red-400';
        break;
      case 2:
        feedback = 'Weak';
        color = 'text-orange-400';
        break;
      case 3:
        feedback = 'Fair';
        color = 'text-yellow-400';
        break;
      case 4:
        feedback = 'Good';
        color = 'text-blue-400';
        break;
      case 5:
        feedback = 'Strong';
        color = 'text-green-400';
        break;
      default:
        feedback = '';
    }

    return { score, feedback, criteria, color };
  };

  // Update password strength when new password changes
  useEffect(() => {
    if (passwords.newPassword) {
      setPasswordStrength(evaluatePasswordStrength(passwords.newPassword));
    } else {
      setPasswordStrength({
        score: 0,
        feedback: '',
        criteria: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        }
      });
    }
  }, [passwords.newPassword]);

  // Handles input changes and updates local state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Validates the passwords entered by the user
  const validatePasswords = async () => {
    let tempErrors = {};

    if (!passwords.existingPassword) {
      tempErrors.existingPassword = "Current password is required.";
    }
    
    if (passwords.newPassword === passwords.existingPassword) {
      tempErrors.newPassword = "New password must be different from the current password.";
    }
    
    if (!isStrongPassword(passwords.newPassword)) {
      tempErrors.newPassword = "Password does not meet strength requirements.";
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submits the form after validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validatePasswords();
    
    if (isValid) {
      onUpdatePassword(passwords.existingPassword, passwords.newPassword);
      // Reset form
      setPasswords({
        existingPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const getProgressBarColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-400';
      case 2:
        return 'bg-orange-400';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-blue-400';
      case 5:
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Premium Backdrop with Enhanced Blur */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300" onClick={onClose}></div>
      
      {/* Premium Centered Modal */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className={`relative w-full max-w-xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-8 border-b border-white/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Change Password</h2>
                  <p className="text-gray-400">Update your account security</p>
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

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Current Password */}
              <div>
                <label htmlFor="existingPassword" className="block text-sm font-medium text-gray-300 mb-3">
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={showPasswords.existing ? "text" : "password"}
                    name="existingPassword" 
                    value={passwords.existingPassword} 
                    onChange={handleChange}
                    className={`w-full px-6 py-4 bg-white/10 border ${errors.existingPassword ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 pr-12`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => togglePasswordVisibility('existing')}
                  >
                    <span className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                      {showPasswords.existing ? '🙈 Hide' : '👁️ Show'}
                    </span>
                  </button>
                </div>
                {errors.existingPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.existingPassword}
                  </p>
                )}
              </div>

              {/* New Password with Strength Indicator */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-3">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword" 
                    value={passwords.newPassword} 
                    onChange={handleChange}
                    className={`w-full px-6 py-4 bg-white/10 border ${errors.newPassword ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 pr-12`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    <span className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                      {showPasswords.new ? '🙈 Hide' : '👁️ Show'}
                    </span>
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {passwords.newPassword && (
                  <div className="mt-4 space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Strength Label */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        Password Strength: {passwordStrength.feedback}
                      </span>
                    </div>
                    
                    {/* Criteria Checklist */}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className={`flex items-center gap-2 ${passwordStrength.criteria.length ? 'text-green-400' : 'text-gray-400'}`}>
                        <span>{passwordStrength.criteria.length ? '✅' : '⭕'}</span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`flex items-center gap-2 ${passwordStrength.criteria.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>{passwordStrength.criteria.uppercase ? '✅' : '⭕'}</span>
                          <span>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength.criteria.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>{passwordStrength.criteria.lowercase ? '✅' : '⭕'}</span>
                          <span>Lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength.criteria.number ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>{passwordStrength.criteria.number ? '✅' : '⭕'}</span>
                          <span>Number</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength.criteria.special ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>{passwordStrength.criteria.special ? '✅' : '⭕'}</span>
                          <span>Special character</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-3">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword" 
                    value={passwords.confirmPassword} 
                    onChange={handleChange}
                    className={`w-full px-6 py-4 bg-white/10 border ${
                      errors.confirmPassword 
                        ? 'border-red-400/50' 
                        : passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword
                        ? 'border-green-400/50 bg-green-400/10'
                        : 'border-white/20'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 pr-12`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    <span className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                      {showPasswords.confirm ? '🙈 Hide' : '👁️ Show'}
                    </span>
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {passwords.confirmPassword && (
                  <p className={`mt-2 text-sm flex items-center gap-1 ${
                    passwords.newPassword === passwords.confirmPassword 
                      ? 'text-green-400' 
                      : 'text-orange-400'
                  }`}>
                    <span>{passwords.newPassword === passwords.confirmPassword ? '✅' : '⚠️'}</span>
                    {passwords.newPassword === passwords.confirmPassword 
                      ? 'Passwords match' 
                      : 'Passwords do not match'
                    }
                  </p>
                )}
                
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

            </form>

            {/* Modal Footer */}
            <div className="relative border-t border-white/20 p-8 bg-gradient-to-r from-white/5 to-white/10 rounded-b-3xl">
              <div className="flex justify-end gap-4">
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
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePasswordModal;