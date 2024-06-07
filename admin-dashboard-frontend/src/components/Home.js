import React from 'react';
import RecentReviews from './Dashboard/RecentReviews';
import './Home.css';  // Assuming you will create a separate CSS file for styling

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the SOIL Organic Admin Dashboard</h1>
            <p>This is the central hub for managing users, products, reviews, and viewing metrics.</p>
            <p>Navigate using the menu to start managing the application.</p>
            <p>Below is a widget that fetch recent three reviews.</p>

            {/* Include the RecentReviews component to display recent activity */}
            <section>
                <h2>Latest Review Activity</h2>
                <RecentReviews />
            </section>
        </div>
    );
};

export default Home;