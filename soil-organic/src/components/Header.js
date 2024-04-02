import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear the user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // Redirect to the sign-in page
    navigate('/signin');
  };

  return (
    <header className="bg-green-500 text-white p-4 flex justify-between items-center">
      <h1>SOIL Organic Grocer</h1>
      <button 
        onClick={handleSignOut} 
        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </header>
  );
}

export default Header;
