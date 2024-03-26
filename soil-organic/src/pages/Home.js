// src/pages/HomePage.js
import React from 'react';

function Home() {
  return (
    <div>
      <header style={{background: 'green', color: 'white', padding: '10px 5%', textAlign: 'center'}}>
        <h1>Welcome to SOIL</h1>
        <p>Your destination for premium, organic fresh food.</p>
      </header>
      <section style={{margin: '20px 5%'}}>
        <h2>About Us</h2>
        <p>
          SOIL is a long-term organic food grocer dedicated to bringing the best organic foods to the community. We believe in sustainable, healthy living and offer a range of products and services to support that belief.
        </p>
        <p>
          Explore our site to learn more about our products, our mission, and how you can get involved in making healthier, sustainable food choices.
        </p>
      </section>
      {/* Future Content Sections Here */}
    </div>
  );
}

export default Home;
