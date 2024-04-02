import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav>
      <ul className="flex space-x-4 justify-center py-5 gap-5" style={{fontSize:'1.2rem', fontWeight:'bolder'}}>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/specials">Specials</Link></li>
      </ul>
    </nav>
  );
}

export default NavigationBar;
