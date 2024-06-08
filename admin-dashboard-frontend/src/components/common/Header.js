import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation


const Header = () => {
    return (
        <header className="header bg-slate-800 border-2 shadow-lg">
            <h1 className='text-white font-bold text-4xl p-5'>SOIL Organic Admin Dashboard</h1>
            <div className='flex justify-around items-center'>
            <nav>
                <ul className="nav-links flex justify-center gap-5 text-2xl text-white font-bold p-4">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/users">User Management</Link></li>
                    <li><Link to="/products">Product Management</Link></li>
                    <li><Link to="/reviews">Review Management</Link></li>
                    <li><Link to="/metrics">Metrics</Link></li>
                </ul>
            </nav>
            <div className="user-info text-white font-bold text-2xl">
                <span>Logged in as: admin_email@soil.com</span> {/* Hardcoded for simplicity */}
            </div>
            </div>
        </header>
    );
};

export default Header;