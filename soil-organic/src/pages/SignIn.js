import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful login
import Navigator from '../components/NavigationBar';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(''); // Reset error message on input change
  };

  const validateForm = () => {
    if (!formData.email) {
      setErrorMessage("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("A valid email is required.");
      return false;
    }
    if (!formData.password) {
      setErrorMessage("Password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const storedUser = localStorage.getItem(formData.email);
      if (storedUser) {
        const { password } = JSON.parse(storedUser);
        // Assuming password stored in localStorage is hashed (base64 for demonstration)
        if (password === btoa(formData.password)) {
          alert("Login successful!");
          // Redirect or manage logged-in state here
          navigate('/profile'); // Redirecting to the profile page
        } else {
          setErrorMessage("Incorrect password.");
        }
      } else {
        setErrorMessage("User does not exist.");
      }
    }
  };

  return (
    <div>
      <Navigator />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button type="submit" className="bg-green-500 text-white p-2">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
