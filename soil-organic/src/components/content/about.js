/**
 * About.js
 * 
 * This module defines a React component for the "About Us" page of the application.
 * It presents a narrative about the organization, SOIL, which emphasizes its commitment
 * to sustainable living and organic food. The page includes textual content about SOIL's mission
 * and values, alongside a descriptive image to visually represent the message.
 * 
 * The component utilizes basic React and Tailwind CSS for styling.
 */

import React from "react";
import aboutus from "../../images/aboutUs-collage.jpg";   // Importing the image used in the About Us page.

function About() {
  return (
    <section className="continer mx-auto flex py-5 px-5 about text-primary">
      <div className="description flex-col justify-center p-2">
        <h1 className="text-center py-5">About Us</h1>
        <p className="text-left px-10 text-xl">
          Welcome to SOIL, your premier destination for premium organic food in
          Melbourne. At SOIL, we believe in more than just providing nourishment
          for the body; we're dedicated to cultivating a community centered
          around sustainable living, healthy eating, and mindful consumption.
          With a rich history rooted in a passion for organic farming and a
          commitment to environmental stewardship, SOIL stands as a beacon of
          freshness and quality in the bustling food market.
        </p>
      </div>
      <div>
        <img src={aboutus} className="px-20" alt='about-us'></img>
      </div>
    </section>
  );
}

export default About;
