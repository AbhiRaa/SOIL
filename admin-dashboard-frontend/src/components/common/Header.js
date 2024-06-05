import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import './Header.css'; // Assuming you will create a separate CSS file for styles

const Header = () => {
    return (
        <header className="header">
            <h1>SOIL Organic Admin Dashboard</h1>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/users">User Management</Link></li>
                    <li><Link to="/products">Product Management</Link></li>
                    <li><Link to="/reviews">Review Management</Link></li>
                    <li><Link to="/metrics">Metrics</Link></li>
                </ul>
            </nav>
            <div className="user-info">
                <span>Logged in as: admin_email@soil.com</span> {/* Hardcoded for simplicity */}
            </div>
        </header>
    );
};

export default Header;