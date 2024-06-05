import React from 'react';
import './Home.css';  // Assuming you will create a separate CSS file for styling

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the SOIL Organic Admin Dashboard</h1>
            <p>This is the central hub for managing users, products, reviews, and viewing metrics.</p>
            <p>Navigate using the menu to start managing the application.</p>
        </div>
    );
};

export default Home;