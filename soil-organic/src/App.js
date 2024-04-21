import React, { createContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import ProfilePage from "./pages/Profile";
import SpecialsPage from "./pages/Specials";
import { getUser, setUser, verifyUser } from "./data/users";
import UserContext from "./hooks/context";
import ShoppingCart from './components/ShoppingCart';
import MealPlanningApp from "./pages/MealPlanningApp";

function App() {
  const [currentloggedInUser, setLoggedInUser] = useState(null);

  const signIn = (userObject) => {
    if (userObject !== null) {
      setUser(userObject)
      setLoggedInUser(userObject.email);
    }
  };

  function signOut() {
    localStorage.setItem("user", null);
    setLoggedInUser(null);
  }

  function signUp(userObject) {
    setUser(userObject);
    setLoggedInUser(userObject.email);
  }

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
