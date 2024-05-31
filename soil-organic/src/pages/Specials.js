import React from "react";
import Navigator from "../components/NavigationBar";
import ProductList from '../components/ProductList';
import BackyardGardeningTips from '../components/gardeningInfo';
import imagePeeking1 from '../images/imagePeeking1.png';
import peekingPeanuts from '../images/peekingPeanuts.webp';
import Footer from '../components/Footer';

function Specials() {
  return (
    <div className="min-h-screen bg-orange-100 relative overflow-x-hidden">
       {/* Image peeking at the left edge */}
       <div className="absolute right-0 top-1/4 -translate-y-1/3 translate-x-2/3 z-15">
        <img src={imagePeeking1} alt="" className="w-auto" />
        </div>
       <div className="absolute left-0 top-1/4  -translate-y-1/3 -translate-x-2/3 z-30">
        <img src={imagePeeking1} alt="" className="w-auto" />
      </div>
      <Navigator/>
      <section className="intro p-10 gap-5">
      <div className="absolute right-0 bottom-1/4 -translate-y-1/2 translate-x-1/2 z-15 bg">
      <img src={peekingPeanuts} alt="" className="w-auto" />
      </div>
      {/* <div className="bg-specialsPage bg-cover w-full"> */}
      <div>
        <h1 className="text-7xl pb-3 text-custom-green">Our Products</h1>  
      </div>
      <div>
        <p className="text-primary font-bold text-lg mt-4">
          Explore our offerings and find everything from crisp, locally-grown vegetables to artisanal breads, 
          all-natural dairy products, and ethically-raised meats. Our commitment to sustainability means every purchase supports not only your 
          health but also the well-being of the environment and local farming communities.
          Shop with us today and experience the purity of nature with every bite. Discover the true taste of organic goodness!
        </p>
      </div>
      {/* </div> */}
      </section>
      <ProductList />
      {/* <BackyardGardeningTips /> */}
      <Footer/>
    </div>
  );
}

export default Specials;
