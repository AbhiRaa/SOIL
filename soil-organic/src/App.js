/**
 * The main application component that sets up routing and global state for user authentication.
 * This component initializes routing for the application, provides user context throughout the app,
 * and handles user sign-in, sign-out, and sign-up functionalities.
 *
 * The application uses React Router for navigation between different pages and manages the user state
 * using a React context (`UserContext`). User authentication state is persisted across components,
 * allowing conditional rendering of components based on the user's authentication status.
 *
 * @module App
 */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { eventEmitter } from './utils/axiosUtil'; // Import the event emitter for handling global events
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import ProfilePage from "./pages/Profile";
import SpecialsPage from "./pages/Specials";
import UserContext from "./hooks/context";
import ShoppingCart from './components/ShoppingCart';
import MealPlanningApp from "./pages/MealPlanningApp";
import Notification from '../src/utils/notifications';

function App() {
  // Initialize user from localStorage to maintain session after refresh
  const [currentloggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notification, setNotification] = useState(''); // State for displaying notifications

  // Effect hook to update localStorage when currentloggedInUser changes
  useEffect(() => {
    if (currentloggedInUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentloggedInUser));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access_token');  // Ensure to clear token when user logs out or is set to null
    }
  }, [currentloggedInUser]);

  // To handle session-expire - listen an event from axiosUtil
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Session expired or user unauthorized.");
      setNotification('Your session has expired. Please sign in again.');
      setTimeout(() => setNotification(''), 3000);
      signOut(); // This will handle the cleanup and redirection
    };

    // Subscribe to the unauthorized event
    eventEmitter.on('unauthorized', handleUnauthorized);

    return () => {
      // Clean up the event listener when the component unmounts
      eventEmitter.off('unauthorized', handleUnauthorized);
    };
  }, []); 

  // Handler to sign in a user, setting the user's email as the current user
  const signIn = (userObject) => {
    if (userObject !== null) {
      setLoggedInUser({
        userId: userObject.userId,
        userName: userObject.userName,
        userEmail: userObject.userEmail
      });
    }
  };

  // Handler to sign out a user, clearing the user from local storage and state
  function signOut() {
    localStorage.removeItem('currentUser'); 
    localStorage.removeItem('access_token');
    setLoggedInUser(null);
    window.location.href = '/signin'; // Redirect to signin page
  }

  // Handler to sign up a user, adding the user to the data store and setting the user as the current user
  async function signUp (userObject) {
    if (userObject !== null) {
      setLoggedInUser({
        userId: userObject.userId,
        userName: userObject.userName,
        userEmail: userObject.userEmail
      });
    }
  }

  // Handler to update user name in the context whenever there is a name update in the profile page
  const updateUserContext = (userObject) => {
    if (userObject !== null) {
      setLoggedInUser({
        userId: userObject.userId,
        userName: userObject.userName,
        userEmail: userObject.userEmail
      });
    }
  }

  // Handler to sign up a user, adding the user to the data store and setting the user as the current user
  return (
    <Router>
      <main>
        <UserContext.Provider value={{ currentloggedInUser, signOut }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage signUp={signUp} />} />
            {/* Redirect from SignInPage to ProfilePage if already logged in */}
            <Route path="/signin" element={<SignInPage signIn={signIn} />} />
            {/* Protect the ProfilePage route, redirecting to SignInPage if not logged in */}
            <Route path="/profile" element={<ProfilePage updateUserContext={updateUserContext} />} />
            <Route path="/specials" element={<SpecialsPage />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/meal" element={<MealPlanningApp />} />
            {/* Redirect to HomePage or another route if the route doesn't exist */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <div>{notification && <Notification message={notification} type="warning" />}</div>
        </UserContext.Provider>
      </main>
    </Router>
  );
}

export default App;
