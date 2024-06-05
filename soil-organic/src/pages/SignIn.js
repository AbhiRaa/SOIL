import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after successful login
import Navigator from "../components/NavigationBar";
import { signIn } from "../services/userService.js";
import Notification from '../utils/notifications';

const SignIn = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = React.useState(''); // State for displaying notifications

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Reset error message on input change
  };

  const validateForm = async () => {
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

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validateForm()) {
      try {
        const response = await signIn({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('access_token', response.data.access_token);

        const user = {
          userId: response.data.userId,
          userName: response.data.userName,
          userEmail: response.data.userEmail
        }
        props.signIn(user);
        alert("Login successful!");

        setNotification(`Welcome ${user.userName} to SOIL-ORGANIC!`);

        console.log("Navigating to profile...");

        setTimeout(() => {
            navigate("/profile");
        }, 1000);  // Clear notification after 1 seconds

        // console.log("Navigating to profile...");
        // navigate("/profile"); // Redirect on successful registration
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setErrorMessage("User not found. Please try again.");
              break;
            case 400:
              setErrorMessage("Incorrect email or password. Please try again.");
              break;
            case 403:
              setNotification(`Account is blocked. Please contact support at admin@soil.com.`);
              break;
            default:
              setErrorMessage("An unexpected error occurred. Please try again.");
          }
        } else {
          setErrorMessage("Network error. Please check your connection and try again.");
        }
      }
    }
  };

  return (
    <>
    <div className="flex-col min-h-screen bg-signIn bg-cover">
      <Navigator className="text-primary" />
      {/* Side Illustration Panel */}
      {/* Form Container */}
      <div className="w-full flex justify-around">
        <div className="md:w-1/2"></div>
        <div className=" flex flex-col justify-end p-12 rounded-md border-2 m-10 border-primary shadow-2xl">
        <div className="max-w-md w-full mx-auto">
          <h2 className="mb-6 text-3xl font-bold text-center text-primary">
            Sign in
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600 block"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-600 block"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              className="w-full p-2 bg-primary text-white rounded"
            >
              Let's start!
            </button>
          </form>
          {notification && <Notification message={notification} />}
          <div className="mt-6 text-center">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-primary">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default SignIn;
