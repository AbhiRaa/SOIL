import React from "react";
import Navigator from "../components/NavigationBar";
import ProductList from '../components/ProductList';

function Specials() {
  return (
    <div className="min-h-screen bg-orange-100">
      <Navigator/>
      <section className="intro p-10 gap-5  ">
      <div>
        <h1 className="text-7xl pb-3 text-custom-green">Weekly Specials</h1>  
      </div>
      <div>
        <p className="text-primary font-bold text-lg mt-4">
          Welcome to our Weekly Specials! Every week, 
          we handpick top-quality organic products and offer them at exclusive discounts 
          just for you. Explore a variety of fresh, sustainably sourced items—from vibrant 
          fruits and vegetables to wholesome dairy and pantry essentials—at prices that are too
          good to miss. Whether you're stocking up on staples or trying something new, 
          our specials are designed to give you the best of organic goodness without 
          stretching your budget.
          Dive into this week's deals and discover your new favorite products!
        </p>
      </div>
      </section>
      <ProductList />
    </div>
  );
}

export default Specials;
