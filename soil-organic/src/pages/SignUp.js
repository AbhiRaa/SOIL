import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after successful signup
// import { isStrongPassword } from '../utils/validation';
import Navigator from "../components/NavigationBar";
import { setUser } from "../data/users.js";

import { isStrongPassword } from "../utils/validation.js";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    const key = await crypto.subtle.importKey(
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
      newErrors["password"] =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
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
      console.log(formData);
      const hashedPassword = await generatePasswordHash(
        formData.password,
        salt
      );
      // Saving user with hashed password and salt to local storage
      const user = {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        salt: btoa(String.fromCharCode(...salt)),
        joinDate: new Date().toISOString(), // Storing the current timestamp
        profile: {
          age: "",
          weight: "",
          height: "",
          activityLevel: "",
          dietaryPreferences: [],
          healthGoals: []
        }
      };

      props.signUp(user);
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-signIn bg-cover">
      <div>
        <Navigator />
      </div>
      {/* Sign Up Form */}
      <div className="flex justify-end">
      <div className="flex justify-center p-12 rounded-md border-2 m-10 border-primary shadow-2xl md:w-1/3 content-center">
        <div className="md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold text-center text-primary">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-600 block"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
              )}
            </div>
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
                onChange={handleChange}
                required
                className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
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
                onChange={handleChange}
                required
                className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-600 block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <a href="/signin" className="text-primary">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SignUp;
