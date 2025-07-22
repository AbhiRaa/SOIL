import React from "react";
import Navigator from "../components/NavigationBar";
import ProductList from '../components/ProductList';
import imagePeeking1 from '../images/imagePeeking1.png';
import peekingPeanuts from '../images/peekingPeanuts.webp';
import Footer from '../components/Footer';

/**
 * Enhanced Specials page with improved background and modern design
 * Features better navbar visibility and enhanced visual hierarchy
 */
function Specials() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
      
      {/* Decorative Images */}
      <div className="absolute right-0 top-1/4 -translate-y-1/3 translate-x-2/3 z-10 opacity-20">
        <img src={imagePeeking1} alt="" className="w-auto" />
      </div>
      <div className="absolute left-0 top-1/4 -translate-y-1/3 -translate-x-2/3 z-10 opacity-20">
        <img src={imagePeeking1} alt="" className="w-auto" />
      </div>
      <div className="absolute right-0 bottom-1/4 -translate-y-1/2 translate-x-1/2 z-10 opacity-20">
        <img src={peekingPeanuts} alt="" className="w-auto" />
      </div>

      {/* Navigation */}
      <Navigator/>

      {/* Hero Section */}
      <section className="relative z-20 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <span className="text-2xl">🥬</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our <span className="text-green-400">Premium Products</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-8"></div>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              Discover the finest selection of organic produce, artisanal goods, and sustainable products
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-lg text-gray-200 leading-relaxed">
                Explore our offerings and find everything from <span className="text-green-400 font-semibold">crisp, locally-grown vegetables</span> to 
                <span className="text-green-400 font-semibold"> artisanal breads</span>, <span className="text-green-400 font-semibold">all-natural dairy products</span>, and 
                <span className="text-green-400 font-semibold"> ethically-raised meats</span>. Our commitment to sustainability means every purchase supports not only your 
                health but also the well-being of the environment and local farming communities.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-green-300 font-medium">
                  🌱 Shop with us today and experience the purity of nature with every bite
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Organic Products</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">Sustainably Sourced</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">23+</div>
              <div className="text-gray-300">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative z-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <ProductList />
        </div>
      </section>

      <div className="relative z-30">
        <Footer/>
      </div>
    </div>
  );
}

export default Specials;
