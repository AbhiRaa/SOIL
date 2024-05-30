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
import React, {useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import ProfilePage from "./pages/Profile";
import SpecialsPage from "./pages/Specials";
import {setUser} from "./data/users";
import UserContext from "./hooks/context";
import ShoppingCart from './components/ShoppingCart';
import MealPlanningApp from "./pages/MealPlanningApp";

function App() {
  const [currentloggedInUser, setLoggedInUser] = useState(null);

  // Handler to sign in a user, setting the user's email as the current user
  const signIn = (userObject) => {
    if (userObject !== null) {
      setLoggedInUser(userObject.email);
    }
  };

  // Handler to sign out a user, clearing the user from local storage and state
  function signOut() {
    localStorage.removeItem('access_token');
    setLoggedInUser(null);
  }

  // Handler to sign up a user, adding the user to the data store and setting the user as the current user
  async function signUp(userObject) {
    // await setUser(userObject);
    setLoggedInUser(userObject);
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/specials" element={<SpecialsPage />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/meal" element={<MealPlanningApp />} />
            {/* Redirect to HomePage or another route if the route doesn't exist */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </UserContext.Provider>
      </main>
    </Router>
  );
}

export default App;
