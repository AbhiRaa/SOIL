import React, { useState } from 'react';

function ChangePasswordModal({ user,isOpen, onClose, onUpdatePassword }) {
  const [passwords, setPasswords] = useState({
    existingPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    let tempErrors = {};
    if (passwords.newPassword === passwords.existingPassword) {
      tempErrors.newPassword = "New password must be different from the existing password.";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      tempErrors.confirmPassword = "Confirm password does not match new password.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePasswords()) {
      onUpdatePassword(passwords.newPassword);
      onClose(); // Close modal after update
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl text-primary font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div>
            <label htmlFor="existingPassword" className="block text-lg font-medium text-primary">Existing Password:</label>
            <input type="password" name="existingPassword" value={passwords.existingPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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
