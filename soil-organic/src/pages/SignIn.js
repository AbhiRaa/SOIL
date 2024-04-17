import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after successful login
import Navigator from "../components/NavigationBar";
import { findUser } from "../data/users";

const SignIn = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Reset error message on input change
  };

  // Add the same hashing functionality you use in your SignUp component
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const storedUserData = findUser(formData.email);
      if (storedUserData) {
        const salt = Uint8Array.from(atob(storedUserData.salt), (c) =>
          c.charCodeAt(0)
        );
        const hashedPassword = await generatePasswordHash(
          formData.password,
          salt
        );

        if (hashedPassword === storedUserData.password) {
          props.signIn(storedUserData);
          alert("Login successful!");

          console.log("Navigating to profile...");

          navigate("/profile");
        } else {
          setErrorMessage("Incorrect password.");
        }
      } else {
        setErrorMessage("User does not exist.");
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
