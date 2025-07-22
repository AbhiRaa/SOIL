import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../hooks/context";
import logo from "../images/logo.png";

/**
 * Enhanced NavigationBar component with modern responsive design and better UX.
 * Features mobile menu, active states, user dropdown, and improved styling.
 */
function NavigationBar() {
  const { currentloggedInUser, signOut } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, className = "", onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 ${
        isActivePath(to) 
          ? 'text-green-300 bg-white/10' 
          : 'text-white hover:text-green-300'
      } ${className}`}
    >
      {children}
      {isActivePath(to) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-300 rounded-full"></div>
      )}
    </Link>
  );

  // Guest Navigation
  if (!currentloggedInUser) {
    return (
      <nav className="relative z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src={logo} 
                alt="SOIL Logo" 
                className="w-48 h-32 object-contain transition-transform duration-300 group-hover:scale-110 font-bold" 
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/">🏠 Home</NavLink>
              <NavLink to="/specials">🥬 Our Products</NavLink>
              <NavLink to="/signin">
                <span className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  🔑 Sign In
                </span>
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
              <div className="px-6 py-4 space-y-3">
                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">🏠 Home</NavLink>
                <NavLink to="/specials" onClick={() => setIsMobileMenuOpen(false)} className="block">🥬 Our Products</NavLink>
                <NavLink to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="block">🔑 Sign In</NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Authenticated User Navigation
  return (
    <nav className="relative z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="SOIL Logo" 
              className="w-48 h-32 object-contain transition-transform duration-300 group-hover:scale-110 font-bold" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/">🏠 Home</NavLink>
            <NavLink to="/specials">🥬 Products</NavLink>
            <NavLink to="/meal">📋 Meal Planner</NavLink>
            <NavLink to="/cart">🛒 Cart</NavLink>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative z-50">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentloggedInUser.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium">Hi, {currentloggedInUser.userName}</span>
                <svg 
                  className={`w-4 h-4 text-white transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 block"
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      alert('My Orders page - functionality to be implemented');
                      // TODO: Navigate to orders page when route is created
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                  >
                    <span>📦</span>
                    <span>My Orders</span>
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      console.log('Sign out clicked');
                      setIsUserDropdownOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu for Authenticated Users */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 border-b border-white/10 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentloggedInUser.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium">Hi, {currentloggedInUser.userName}</span>
              </div>
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">🏠 Home</NavLink>
              <NavLink to="/specials" onClick={() => setIsMobileMenuOpen(false)} className="block">🥬 Products</NavLink>
              <NavLink to="/meal" onClick={() => setIsMobileMenuOpen(false)} className="block">📋 Meal Planner</NavLink>
              <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block">🛒 Cart</NavLink>
              <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block">👤 Profile</NavLink>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-200 w-full text-left"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
