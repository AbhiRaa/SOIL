import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../hooks/context";
import logo from "../images/logo.png";

function NavigationBar() {
  let { currentloggedInUser, signOut } = useContext(UserContext);
  console.log(currentloggedInUser);
  return currentloggedInUser == null ? (
    <>
      <nav>
        <header className=" container mx-auto flex items-center justify-between ">
          <img className=" flex-none logoImage" src={logo} alt="Logo" />
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
            <Link to="/specials">Specials</Link>
            </li>
          </ul>
        </header>
      </nav>
    </>
  ) : (
    <>
      <nav>
      <header className=" container mx-auto flex items-center justify-between ">
        <img className=" flex-none logoImage" src={logo} alt="Logo" />
        <ul
        className="flex space-x-4 justify-center py-5 gap-5 text-xl font-bold"
        >
        <li>
          <Link to="/">Hi,{currentloggedInUser}</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/specials">Specials</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
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
