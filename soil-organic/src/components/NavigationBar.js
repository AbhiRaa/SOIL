import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../hooks/context";
import logo from "../images/logo.png";

/**
 * NavigationBar component displays different navigation links based on the user's authentication status.
 * It uses the UserContext to determine if a user is currently logged in and changes the display accordingly.
 */
function NavigationBar() {
  // Accessing currentloggedInUser and signOut method from UserContext
  let { currentloggedInUser, signOut } = useContext(UserContext);

   // Log the current user status for debugging purposes
  console.log(currentloggedInUser);

  // Conditionally render the navigation bar based on user authentication
  return currentloggedInUser == null ? (
    <>
      <nav>
        <header className=" container mx-auto flex items-center justify-between ">
          <Link to="/"><img className=" flex-none logoImage" src={logo} alt="Logo" /></Link>
          <ul
            className="flex space-x-4 justify-center py-5 gap-5 text-xl font-bold"
          >
            <li>
            <Link to="/">Home</Link>
            </li>
            <li>
            <Link to="/signin">Sign In</Link>
            </li>
            <li>
            <Link to="/specials">Our Products</Link>
            </li>
          </ul>
        </header>
      </nav>
    </>
  ) : (
    <>
      <nav>
      <header className="container mx-auto flex items-center justify-between">
        <Link to="/"><img className=" flex-none logoImage" src={logo} alt="Logo" /></Link>
        <ul
        className="flex space-x-4 justify-center py-5 gap-5 text-xl font-bold"
        >
        <li>
          <Link to="/">Hi,{currentloggedInUser.userName}</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/specials">Our Products</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        <li>
          <Link to="/meal">Meal Planner</Link>
        </li>
        <li>
          <button onClick={signOut}> Sign Out</button>
        </li>
        </ul>
      </header>
    </nav>
    </>
    
  );
}

export default NavigationBar;
