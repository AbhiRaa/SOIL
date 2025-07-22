import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/userService";
import Notification from "../utils/notifications";
import logo from "../images/logo.png";

/**
 * Enhanced SignInPage Component with Dark Theme
 * Maintains original functionality while featuring premium dark theme design
 */
function SignInPage(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [notification, setNotification] = useState("");
    
    const navigate = useNavigate();

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

    // Handles the form submission - maintaining original logic
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

                setNotification(`Login successful. Welcome ${user.userName} to SOIL-ORGANIC!`);

                setTimeout(() => {
                    navigate("/profile");
                }, 1000);

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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-green-300/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-16 w-6 h-6 bg-white/20 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-32 left-20 w-3 h-3 bg-green-400/40 rounded-full animate-pulse animation-delay-1000"></div>
            
            <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo & Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="SOIL Logo" className="w-20 h-16 object-contain" />
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-6">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Welcome Back to <span className="text-green-400">SOIL</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-6"></div>
                        <p className="text-gray-300 text-lg">
                            Sign in to access your organic shopping experience
                        </p>
                    </div>

                    {/* Sign In Form */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-2xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:ring-green-400/50 hover:border-white/30"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 pr-12 focus:ring-green-400/50 hover:border-white/30"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                                            {showPassword ? "🙈 Hide" : "👁️ Show"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <p className="text-red-300 text-sm flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errorMessage}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105"
                            >
                                <span>🚀</span>
                                <span>Let's start!</span>
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center pt-4 border-t border-white/10">
                                <p className="text-gray-300">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        className="font-bold text-green-400 hover:text-green-300 transition-colors duration-200 underline"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-200 font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                        >
                            <span>←</span> 
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>
            
            {notification && <Notification message={notification} />}
        </div>
    );
}

export default SignInPage;