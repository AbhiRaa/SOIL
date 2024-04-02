import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful signup
import { isStrongPassword } from '../utils/validation';
import Navigator from '../components/NavigationBar';

import { isStrongPassword } from '../utils/validation.js';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // Generates a random salt for hashing
  const generateSalt = () => {
    return crypto.getRandomValues(new Uint8Array(16));
  };

  // Hashes the password using PBKDF2 algorithm
  const generatePasswordHash = async (password, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const key = await crypto.subtle.importKey('raw', data, { name: 'PBKDF2' }, false, ['deriveBits']);

    const keyBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 1000,
        hash: 'SHA-1',
      },
      key,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(keyBits)));
  };

  // Validates the form fields and sets error messages if any
  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!formData.name) {
      formIsValid = false;
      newErrors["name"] = "Name is required.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      newErrors["email"] = "A valid email is required.";
    }

    if (!isStrongPassword(formData.password)) {
      formIsValid = false;
      newErrors["password"] = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }

    if (formData.password !== formData.confirmPassword) {
      formIsValid = false;
      newErrors["confirmPassword"] = "Passwords do not match.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // Updates the formData state as the user types in the fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const salt = generateSalt();
      const hashedPassword = await generatePasswordHash(formData.password, salt);
      // Saving user with hashed password and salt to local storage
      const user = { 
        name: formData.name, 
        email: formData.email, 
        password: hashedPassword, 
        salt: btoa(String.fromCharCode(...salt)),
        joinDate: new Date().toISOString() // Storing the current timestamp
      };
      localStorage.setItem(formData.email, JSON.stringify(user));

      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(user));
      alert('Registration successful');
      
      // Redirecting to the profile page upon successful signup
      navigate('/profile');
    }
  };

  return (
    <div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <div className="text-red-500">{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <div className="text-red-500">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <div className="text-red-500">{errors.password}</div>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" className="bg-green-500 text-white p-2">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
