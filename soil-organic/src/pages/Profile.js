import NavigationBar from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import EditProfileModal from '../components/EditProfileModal';
import EditPasswordModal from '../components/updatePasswordModal';
import { getUserDetails, deleteUser, updateUserDetails, changeUserPassword } from "../services/userService";
import Footer from "../components/Footer";
import Notification from '../utils/notifications';
import logo from "../images/logo.png";

/**
 * Enhanced ProfilePage Component with Dark Theme
 * Maintains original functionality while featuring premium dark theme design
 */
const Profile = (props) => {
    const { currentloggedInUser, signOut } = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Retrieve the user object from local storage.
        async function fetchDetails() {
            if (currentloggedInUser && currentloggedInUser.userId) {
                try {
                    const response = await getUserDetails(currentloggedInUser.userId);
                    setUser(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                    navigate("/signin"); // Redirect to sign-in on error or unauthorized
                }
            } else {
                navigate("/signin"); // Redirect if not logged in or userId is missing
            }
        }
        fetchDetails();
    }, [currentloggedInUser, navigate]);

    const handleEdit = () => {
        // Navigate to the user edit profile modal 
        setIsEditModalOpen(true);
    };

    const handleEditPassword = () => {
        // Navigate to the edit password edit modal 
        setIsEditPasswordOpen(true);
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            const response = await updateUserDetails(currentloggedInUser.userId, updatedUser);
            if (response.data && response.data.updatedUser) {
                setUser(response.data.updatedUser); // Update local state with the new user data
                props.updateUserContext({
                    userId: response.data.updatedUser.userId,
                    userName: response.data.updatedUser.userName,
                    userEmail: response.data.updatedUser.userEmail
                }); // Update the context as well if username is updated
                
                setIsEditModalOpen(false);
                setNotification('Profile updated successfully!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            setNotification('Failed to update profile. Please try again.');
            setTimeout(() => setNotification(''), 3000);
            console.error('Update Error:', error);
        }
    };

    const handleDelete = async () => {
        // Create a custom confirmation modal
        const confirmDelete = () => {
            return new Promise((resolve) => {
                // Create modal backdrop
                const backdrop = document.createElement('div');
                backdrop.className = 'fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4';
                
                // Create modal content
                const modal = document.createElement('div');
                modal.className = 'bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 transition-all';
                modal.innerHTML = `
                    <div class="text-center">
                        <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-4xl">⚠️</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-4">Delete Profile?</h3>
                        <p class="text-gray-300 mb-6">
                            This action cannot be undone. All your data including preferences, 
                            meal plans, and personal information will be permanently deleted.
                        </p>
                        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p class="text-red-400 text-sm font-medium">
                                Type <span class="font-mono bg-red-500/20 px-2 py-1 rounded">DELETE</span> to confirm
                            </p>
                            <input 
                                type="text" 
                                id="delete-confirm-input"
                                class="w-full mt-3 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                placeholder="Type DELETE here"
                            />
                        </div>
                        <div class="flex gap-4 justify-center">
                            <button id="cancel-delete" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-medium transition-all duration-300">
                                Cancel
                            </button>
                            <button id="confirm-delete" disabled class="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Delete My Profile
                            </button>
                        </div>
                    </div>
                `;
                
                backdrop.appendChild(modal);
                document.body.appendChild(backdrop);
                document.body.style.overflow = 'hidden';
                
                // Focus input
                const input = document.getElementById('delete-confirm-input');
                const confirmBtn = document.getElementById('confirm-delete');
                const cancelBtn = document.getElementById('cancel-delete');
                
                input.focus();
                
                // Enable/disable confirm button based on input
                input.addEventListener('input', (e) => {
                    if (e.target.value === 'DELETE') {
                        confirmBtn.disabled = false;
                        confirmBtn.className = 'px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105';
                    } else {
                        confirmBtn.disabled = true;
                        confirmBtn.className = 'px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
                    }
                });
                
                // Handle confirm
                confirmBtn.addEventListener('click', () => {
                    document.body.removeChild(backdrop);
                    document.body.style.overflow = '';
                    resolve(true);
                });
                
                // Handle cancel
                cancelBtn.addEventListener('click', () => {
                    document.body.removeChild(backdrop);
                    document.body.style.overflow = '';
                    resolve(false);
                });
                
                // Handle backdrop click
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        document.body.removeChild(backdrop);
                        document.body.style.overflow = '';
                        resolve(false);
                    }
                });
            });
        };
        
        const confirmed = await confirmDelete();
        
        if (confirmed) {
            try {
                setNotification('Deleting your profile...');
                await deleteUser(currentloggedInUser.userId);
                setNotification('Profile deleted successfully. Goodbye! 👋');
                setTimeout(() => {
                    signOut();
                }, 1500);
            } catch (error) {
                setNotification('Failed to delete profile. Please try again.');
                setTimeout(() => setNotification(''), 3000);
                console.error('Delete Error:', error);
            }
        }
    };

    const handleUpdatePassword = async (existingPassword, newPassword) => {
        if (!user) {
            setNotification('User not found.');
            setTimeout(() => setNotification(''), 3000);
            return;
        }
        try {
            const response = await changeUserPassword(currentloggedInUser.userId, existingPassword, newPassword);
            if (response.status === 200) {
                setNotification('Password successfully updated. Please login again!');
                setTimeout(() => signOut(), 1000);
                setIsEditPasswordOpen(false);
            } else {
                throw new Error('Failed to update password.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setNotification(error.response.data.message);
                setTimeout(() => setNotification(''), 3000);
            } else {
                setNotification(error.message || "Failed to update password. Please try again!");
                setTimeout(() => setNotification(''), 3000);
            }
            console.error('Password Update Error:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 right-10 w-4 h-4 bg-green-300/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 left-16 w-6 h-6 bg-white/20 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-32 right-20 w-3 h-3 bg-green-400/40 rounded-full animate-pulse animation-delay-1000"></div>

            {/* Navigation */}
            {!isEditModalOpen && !isEditPasswordOpen && (
                <div className="relative z-20">
                    <NavigationBar />
                </div>
            )}

            {/* Main Content */}
            <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isEditModalOpen || isEditPasswordOpen ? 'pt-20' : ''}`}>
                
                {/* Profile Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-400/20 rounded-full mb-6">
                        <span className="text-3xl">👤</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        My <span className="text-green-400">Profile</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-6"></div>
                    <p className="text-gray-300 text-lg">
                        Manage your personal information and preferences
                    </p>
                </div>

                {/* Profile Content */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-6 p-8 border-b border-white/10">
                        <div className="text-green-400 text-4xl">
                            <i className="fi fi-rr-user"></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Profile Information</h2>
                            <p className="text-gray-300">Personal details and application settings</p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8 space-y-6">
                        {/* Full Name */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white/5 rounded-lg">
                            <dt className="font-medium text-gray-300">Full name</dt>
                            <dd className="md:col-span-2 text-white text-lg font-medium">{user.userName}</dd>
                        </div>

                        {/* Email Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white/5 rounded-lg">
                            <dt className="font-medium text-gray-300">Email address</dt>
                            <dd className="md:col-span-2 text-white text-lg font-medium">{user.userEmail}</dd>
                        </div>

                        {/* Join Date */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white/5 rounded-lg">
                            <dt className="font-medium text-gray-300">Join date</dt>
                            <dd className="md:col-span-2 text-white text-lg font-medium">
                                {new Date(user.joinDate).toLocaleDateString("en-US", {
                                    year: "numeric", 
                                    month: "long", 
                                    day: "numeric", 
                                    weekday: "long"
                                })}
                            </dd>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start p-4 bg-white/5 rounded-lg">
                            <dt className="font-medium text-gray-300">Personal Details</dt>
                            <dd className="md:col-span-2 text-white space-y-1">
                                <div><span className="text-gray-400">Age:</span> {user.age || "Not set"}</div>
                                <div><span className="text-gray-400">Weight:</span> {user.weight || "Not set"} kg</div>
                                <div><span className="text-gray-400">Height:</span> {user.height || "Not set"} cm</div>
                                <div><span className="text-gray-400">Gender:</span> {user.gender || "Not set"}</div>
                                <div><span className="text-gray-400">Activity Level:</span> {user.activityLevel || "Not set"}</div>
                                <div><span className="text-gray-400">Dietary Preferences:</span> {Array.isArray(user.dietaryPreferences) ? user.dietaryPreferences.join(", ") : "None"}</div>
                                <div><span className="text-gray-400">Health Goals:</span> {Array.isArray(user.healthGoals) ? user.healthGoals.join(", ") : "None"}</div>
                            </dd>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4">
                        <button 
                            className="bg-blue-500/80 hover:bg-blue-600/80 text-white font-bold py-3 px-6 rounded-lg backdrop-blur-sm border border-blue-400/30 transition-all duration-300 transform hover:scale-105" 
                            onClick={handleEditPassword}
                        >
                            🔒 Change Password
                        </button>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleEdit} 
                                className="bg-green-500/80 hover:bg-green-600/80 text-white font-bold py-3 px-6 rounded-lg backdrop-blur-sm border border-green-400/30 transition-all duration-300 transform hover:scale-105"
                            >
                                ✏️ Edit Profile
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="bg-red-500/80 hover:bg-red-600/80 text-white font-bold py-3 px-6 rounded-lg backdrop-blur-sm border border-red-400/30 transition-all duration-300 transform hover:scale-105"
                            >
                                🗑️ Delete Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modals - maintaining original modal functionality */}
                {isEditModalOpen && (
                    <EditProfileModal
                        user={user}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdate={handleUpdateUser}
                    />
                )}

                {isEditPasswordOpen && (
                    <EditPasswordModal
                        user={user}
                        isOpen={isEditPasswordOpen}
                        onClose={() => setIsEditPasswordOpen(false)}
                        onUpdatePassword={handleUpdatePassword} 
                    />
                )}
            </div>

            {/* Footer */}
            {!isEditModalOpen && !isEditPasswordOpen && (
                <div className="relative z-30">
                    <Footer />
                </div>
            )}

            {notification && (
                <Notification 
                    message={notification} 
                    type={
                        notification.includes('Failed') || notification.includes('error') ? 'error' :
                        notification.includes('success') || notification.includes('updated') ? 'success' :
                        'info'
                    }
                />
            )}
        </div>
    );
}

export default Profile;