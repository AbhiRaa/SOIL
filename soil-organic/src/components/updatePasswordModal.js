import React, { useState } from 'react';
import { isStrongPassword } from "../utils/validation.js";

/**
 * Modal component for changing user passwords.
 * It allows a user to enter their current password for verification and set a new password.
 * The component checks if the new password meets certain strength requirements and matches the confirmed password.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - The current user object containing the user's hashed password and salt.
 * @param {boolean} props.isOpen - Flag to determine if the modal is visible.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onUpdatePassword - Function to update the user's password.
 */
function ChangePasswordModal({ user,isOpen, onClose, onUpdatePassword }) {
  // State to hold password inputs and error messages
  const [passwords, setPasswords] = useState({
    existingPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Handles input changes and updates local state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  // Asynchronous function to hash the password using PBKDF2
  const generatePasswordHash = async (password, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const importedKey = await crypto.subtle.importKey(
      "raw",
      data,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const keyBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 1000,
        hash: "SHA-1",
      },
      importedKey,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(keyBits)));
  };

   // Validates the passwords entered by the user
  const validatePasswords = async () => {
    let tempErrors = {};
    const salt = Uint8Array.from(atob(user.salt), (c) => c.charCodeAt(0));
    const existingHashedPassword = await generatePasswordHash(passwords.existingPassword, salt);
    // Set error messages if conditions are not met
    if (existingHashedPassword !== user.password) {
      tempErrors.existingPassword = "Existing password is incorrect.";
    }

    if (passwords.newPassword === passwords.existingPassword) {
      tempErrors.newPassword = "New password must be different from the existing password.";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      tempErrors.confirmPassword = "Confirm password does not match new password.";
    }
    if (!isStrongPassword(passwords.newPassword)) {
      tempErrors.newPassword = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submits the form after validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validatePasswords();
    console.log("Form validation result:", isValid, errors);
    if (isValid) {
      const salt = Uint8Array.from(atob(user.salt), (c) => c.charCodeAt(0)); // Use existing salt
      const newHashedPassword = await generatePasswordHash(passwords.newPassword, salt);
      onUpdatePassword(newHashedPassword, user.email); // Pass the hashed password and user email
      console.log("Password update initiated.");
      onClose(); // Close modal after update
    } else {
      console.log("Failed to pass validation:", errors);
    }
  };

  // Return null to prevent the modal from rendering if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl text-primary font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div>
            <label htmlFor="existingPassword" className="block text-lg font-medium text-primary">Existing Password:</label>
            <input type="password" name="existingPassword" value={passwords.existingPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.existingPassword && <p className="text-red-500 text-sm">{errors.existingPassword}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-primary">New Password:</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-primary">Confirm New Password:</label>
            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
            <button onClick={onClose} className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
