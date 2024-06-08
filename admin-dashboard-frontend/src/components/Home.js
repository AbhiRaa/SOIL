import React from 'react';
import RecentReviews from './Dashboard/RecentReviews';
import './Home.css'; 

const Home = () => {
    return (
        <div className="home font-semibold text-2xl mb-4 p-4">
            <h1 className='text-4xl font-semibold text-center'>Welcome to the SOIL Organic Admin Dashboard</h1>
            <div className='flex flex-col items-center justify-center text-center mt-8 mb-8'>
                <p className=''>This is the central hub for managing users, products, reviews, and viewing metrics.</p>
                <p>Navigate using the menu to start managing the application.</p>
            </div>
            {/* Include the RecentReviews component to display recent activity */}
            <section>
                <h2 className='mb-5 mt-5 font-bold text-4xl'>Review Widget</h2>
                <p>Below is a widget that fetch recent three reviews.</p>
                <RecentReviews />
            </section>
        </div>
    );
};

export default Home;