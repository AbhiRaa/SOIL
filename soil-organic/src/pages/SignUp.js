import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful signup
import { isStrongPassword } from '../utils/validation';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!formData.name) {
      formIsValid = false;
      errors["name"] = "Name is required.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      errors["email"] = "A valid email is required.";
    }

    if (formData.password.length < 8) {
      formIsValid = false;
      errors["password"] = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "Passwords do not match.";
    }

    // Validate the strong password
    if (!isStrongPassword(formData.password)) {
      formIsValid = false;
      errors["strongPassword"] = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here, you'd typically hash the password before storing it. For this project, we'll skip this step.
      // Simulating hashing for demonstration. In real applications, NEVER hash passwords on the client side.
      const hashedPassword = btoa(formData.password); // Using Base64 encoding as a placeholder
      const user = { ...formData, password: hashedPassword }
      delete user.confirmPassword;
      localStorage.setItem(formData.email, JSON.stringify(user));
      alert('Registration successful');
      // Automatically log the user in and redirect to the profile page or home page
      // This step is simplified here; adjust based on your app's routing and state management
      navigate('/profile'); // Redirecting to the profile page
    }
  };

  return (
    <div>
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
          />
          {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" className="bg-green-500 text-white p-2">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;