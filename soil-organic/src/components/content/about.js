import React from "react";
import aboutus from "../../images/aboutUs-collage.jpg";

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
        <img src={aboutus} className="px-20"></img>
      </div>
    </section>
  );
}

export default About;
