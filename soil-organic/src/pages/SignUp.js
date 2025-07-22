import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/userService";
import { isStrongPassword } from "../utils/validation";
import Notification from "../utils/notifications";
import logo from "../images/logo.png";

/**
 * Enhanced SignUpPage Component with Dark Theme & Password Strength Indicator
 * Maintains original functionality while featuring premium dark theme design
 */
function SignUpPage(props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: "",
        criteria: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false
        }
    });
    
    const navigate = useNavigate();

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
        let feedback = "";
        let color = "";

        switch (score) {
            case 0:
            case 1:
                feedback = "Very Weak";
                color = "text-red-400";
                break;
            case 2:
                feedback = "Weak";
                color = "text-orange-400";
                break;
            case 3:
                feedback = "Fair";
                color = "text-yellow-400";
                break;
            case 4:
                feedback = "Good";
                color = "text-blue-400";
                break;
            case 5:
                feedback = "Strong";
                color = "text-green-400";
                break;
            default:
                feedback = "";
        }

        return { score, feedback, criteria, color };
    };

    // Update password strength when password changes
    useEffect(() => {
        if (formData.password) {
            setPasswordStrength(evaluatePasswordStrength(formData.password));
        } else {
            setPasswordStrength({
                score: 0,
                feedback: "",
                criteria: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false
                }
            });
        }
    }, [formData.password]);

    // Updates the formData state as the user types in the fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validates the form fields and sets error messages if any - maintaining original validation
    const validateForm = async () => {
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
                "Password must be at least 8 characters,\n" +
                "Include at least one uppercase letter,\n" +
                "Include at least one lowercase letter,\n" +
                "Include at least one special character,\n" +
                "Include at least one number.";
        }

        if (formData.password !== formData.confirmPassword) {
            formIsValid = false;
            newErrors["confirmPassword"] = "Passwords do not match.";
        }

        setErrors(newErrors);
        return formIsValid;
    };

    // Handles the form submission - maintaining original logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await validateForm()) {
            try {
                const response = await signUp({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('access_token', response.data.access_token);

                const user = {
                    userId: response.data.userId,
                    userName: response.data.userName,
                    userEmail: response.data.userEmail
                }
                await props.signUp(user);

                setNotification(`Welcome ${user.userName} to SOIL-ORGANIC!`);
                setTimeout(() => {
                    navigate("/profile");
                }, 1000);

            } catch (error) {
                // Handle errors like email already exists here
                if (error.response && error.response.status === 409) {
                    setErrors({ email: "Email already exists. Please try another one." });
                } else {
                    setErrors({ form: "An unexpected error occurred. Please try again." });
                }
            }
        }
    };

    const getProgressBarColor = () => {
        switch (passwordStrength.score) {
            case 0:
            case 1:
                return "bg-red-400";
            case 2:
                return "bg-orange-400";
            case 3:
                return "bg-yellow-400";
            case 4:
                return "bg-blue-400";
            case 5:
                return "bg-green-400";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 right-10 w-4 h-4 bg-green-300/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 left-16 w-6 h-6 bg-white/20 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-32 right-20 w-3 h-3 bg-green-400/40 rounded-full animate-pulse animation-delay-1000"></div>
            
            <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo & Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="SOIL Logo" className="w-32 h-24 object-contain" />
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-6">
                            <span className="text-2xl">🌱</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Join <span className="text-green-400">SOIL</span> Community
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-6"></div>
                        <p className="text-gray-300 text-lg">
                            Start your organic shopping journey today
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-2xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 ${
                                        errors.name
                                            ? "border-red-400/50 focus:ring-red-400/50 bg-red-400/10"
                                            : "focus:ring-green-400/50 hover:border-white/30"
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 ${
                                        errors.email
                                            ? "border-red-400/50 focus:ring-red-400/50 bg-red-400/10"
                                            : "focus:ring-green-400/50 hover:border-white/30"
                                    }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field with Strength Indicator */}
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
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 pr-12 ${
                                            errors.password
                                                ? "border-red-400/50 focus:ring-red-400/50 bg-red-400/10"
                                                : "focus:ring-green-400/50 hover:border-white/30"
                                        }`}
                                        placeholder="Create a strong password"
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
                                
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-3 space-y-2">
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
                                        <div className="grid grid-cols-1 gap-1 text-xs">
                                            <div className={`flex items-center gap-2 ${passwordStrength.criteria.length ? 'text-green-400' : 'text-gray-400'}`}>
                                                <span>{passwordStrength.criteria.length ? '✅' : '⭕'}</span>
                                                <span>At least 8 characters</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`flex items-center gap-1 ${passwordStrength.criteria.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                                                    <span>{passwordStrength.criteria.uppercase ? '✅' : '⭕'}</span>
                                                    <span>Uppercase</span>
                                                </div>
                                                <div className={`flex items-center gap-1 ${passwordStrength.criteria.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                                                    <span>{passwordStrength.criteria.lowercase ? '✅' : '⭕'}</span>
                                                    <span>Lowercase</span>
                                                </div>
                                                <div className={`flex items-center gap-1 ${passwordStrength.criteria.number ? 'text-green-400' : 'text-gray-400'}`}>
                                                    <span>{passwordStrength.criteria.number ? '✅' : '⭕'}</span>
                                                    <span>Number</span>
                                                </div>
                                                <div className={`flex items-center gap-1 ${passwordStrength.criteria.special ? 'text-green-400' : 'text-gray-400'}`}>
                                                    <span>{passwordStrength.criteria.special ? '✅' : '⭕'}</span>
                                                    <span>Symbol</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {errors.password && (
                                    <div className="mt-2 text-sm text-red-300">
                                        {errors.password.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}<br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 pr-12 ${
                                            errors.confirmPassword
                                                ? "border-red-400/50 focus:ring-red-400/50 bg-red-400/10"
                                                : formData.confirmPassword && formData.password === formData.confirmPassword
                                                ? "border-green-400/50 focus:ring-green-400/50 bg-green-400/10"
                                                : "focus:ring-green-400/50 hover:border-white/30"
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                                            {showConfirmPassword ? "🙈 Hide" : "👁️ Show"}
                                        </span>
                                    </button>
                                </div>
                                
                                {/* Password Match Indicator */}
                                {formData.confirmPassword && (
                                    <p className={`mt-2 text-sm flex items-center gap-1 ${
                                        formData.password === formData.confirmPassword 
                                            ? 'text-green-400' 
                                            : 'text-orange-400'
                                    }`}>
                                        <span>{formData.password === formData.confirmPassword ? '✅' : '⚠️'}</span>
                                        {formData.password === formData.confirmPassword 
                                            ? 'Passwords match' 
                                            : 'Passwords do not match'
                                        }
                                    </p>
                                )}
                                
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Form-wide errors */}
                            {errors.form && (
                                <p className="text-red-300 text-sm flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.form}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105"
                            >
                                <span>🌱</span>
                                <span>Sign Up</span>
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center pt-4 border-t border-white/10">
                                <p className="text-gray-300">
                                    Already have an account?{" "}
                                    <Link
                                        to="/signin"
                                        className="font-bold text-green-400 hover:text-green-300 transition-colors duration-200 underline"
                                    >
                                        Sign in
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
            
            {notification && <Notification message={notification} type="success" />}
        </div>
    );
}

export default SignUpPage;