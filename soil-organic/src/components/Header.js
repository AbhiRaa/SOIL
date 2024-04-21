import React from "react";
import logo from "../images/logo.png";
import Navbar from "../components/NavigationBar";
import "../styling/header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="parent-container bg-cover bg-opacity-100">
        {/* <header className=" container mx-auto flex items-center justify-between "> */}
          {/* <img className=" flex-none logoImage" src={logo} alt="Logo" /> */}
          <Navbar />
        {/* </header> */}
        <section className="container flex-col items-center justify-center mx-auto">
          <h1 className="flex py-1 mt-3 justify-center items-center">
            WELCOME TO <br />
            SOIL.
          </h1>
          <h3 className="text-center">
            Your favourite organic food grocer has been Melbourne's go-to
            destination
            <br /> for the freshest fruits and vegetables since it's
            establishment in 2001.
          </h3>
        </section>
      </div>
    </>
  );
}

export default Header;
