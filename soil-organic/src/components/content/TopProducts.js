/**
 * Enhanced TopProducts.js - Carousel Implementation
 * 
 * Features a modern carousel design for showcasing top-rated products
 * on the home page with smooth scrolling, navigation arrows, and responsive layout.
 */
import React, { useEffect, useContext, useState, useRef } from 'react';
import useCart from '../../hooks/useCart';
import UserContext from "../../hooks/context";
import Notification from '../../utils/notifications';
import ReviewModal from '../ReviewModal';
import StarRatings from 'react-star-ratings';
import { getAllPublicProducts, getAllSecureProducts } from "../../services/productService";

function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  let { currentloggedInUser } = useContext(UserContext);
  const [notification, setNotification] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewCounts, setReviewCounts] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  // Fetch top-rated products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = currentloggedInUser ? await getAllSecureProducts() : await getAllPublicProducts();
        
        // Calculate average ratings and filter by 4.8+ rating
        const ratedProducts = response.data.map(product => {
          const visibleReviews = product.reviews.filter(review => review.is_visible);
          // Only calculate average if there are visible reviews, otherwise rating is 0
          const averageRating = visibleReviews.length > 0 
            ? visibleReviews.reduce((acc, review) => acc + review.rating, 0) / visibleReviews.length 
            : 0;
          return { ...product, averageRating };
        });
        
        // Filter products with 4.8+ rating and sort by rating (highest first)
        const topProducts = ratedProducts
          .filter(product => product.averageRating >= 4.8)
          .sort((a, b) => b.averageRating - a.averageRating);
        
        setProducts(topProducts);
        
        // Set review counts and ratings
        const counts = {};
        const averages = {};
        topProducts.forEach(product => {
          const visibleReviews = product.reviews.filter(review => review.is_visible);
          counts[product.product_id] = visibleReviews.length;
          averages[product.product_id] = product.averageRating;
        });
        
        setReviewCounts(counts);
        setAverageRatings(averages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, [currentloggedInUser]);

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    setNotification(`Added ${product.product_name} to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const updateReviewCounts = (productId, newCount) => {
    setReviewCounts(prevCounts => ({ ...prevCounts, [productId]: newCount }));
  };
  
  const updateAverageRatings = (productId, newAverageRating) => {
    setAverageRatings(prevRatings => ({ ...prevRatings, [productId]: newAverageRating }));
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, products.length - getVisibleItems());
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 3; // xl
      if (window.innerWidth >= 1024) return 2; // lg
      return 1; // sm and below
    }
    return 3;
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative py-16 px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-white to-orange-50/50"></div>
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Our <span className="text-primary">Premium Rated</span> Products
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-green-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our premium products with 4.8+ star ratings, loved by Melbourne's health-conscious community
          </p>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600 font-medium">Organic Certified</div>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide >= Math.max(0, products.length - getVisibleItems())}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / getVisibleItems())}%)` }}
            >
              {products.map((product, index) => (
                <div 
                  key={product.product_id}
                  className="w-full lg:w-1/2 xl:w-1/3 flex-shrink-0 px-4"
                >
                  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:bg-white/95 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Special Badge */}
                    {product.is_special && (
                      <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        🌟 Special
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={`http://localhost:4000/${product.product_image}`} 
                        alt={product.product_name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6 space-y-4">
                      {/* Product Name & Price */}
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                          {product.product_name}
                        </h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-600">
                            ${parseFloat(product.product_price).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {product.product_description}
                      </p>

                      {/* Product Details */}
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between items-center text-gray-500">
                          <span>Quantity:</span>
                          <span className="font-medium text-gray-800">{product.minimum_purchase_unit}</span>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center gap-2">
                            <StarRatings
                              rating={averageRatings[product.product_id]}
                              starRatedColor="#fbbf24"
                              numberOfStars={5}
                              name='rating'
                              starDimension="16px"
                              starSpacing="1px"
                            />
                            <span className="text-gray-600 text-xs">
                              ({averageRatings[product.product_id]?.toFixed(1) || '0.0'})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {currentloggedInUser && (
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          {product.product_stock === 0 ? (
                            <div className="text-center py-3 bg-red-50 border border-red-200 rounded-lg">
                              <span className="text-red-600 font-bold text-sm">Out of Stock</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <span>🛒</span>
                              <span>Add to Cart</span>
                            </button>
                          )}
                          
                          {/* Reviews Button */}
                          <button 
                            onClick={() => handleOpenReviewModal(product)} 
                            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                          >
                            {reviewCounts[product.product_id] ? 
                              `📝 ${reviewCounts[product.product_id]} reviews` : 
                              '📝 No reviews yet'
                            }
                          </button>
                        </div>
                      )}
                      
                      {/* Guest View - Show Login Prompt */}
                      {!currentloggedInUser && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="text-center py-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-700 text-sm font-medium mb-2">Sign in to purchase</p>
                            <a 
                              href="/signin" 
                              className="text-blue-600 hover:text-blue-500 underline text-sm font-semibold"
                            >
                              Sign In Now
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(1, products.length - getVisibleItems() + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-primary shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <a 
            href="/specials" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>🛒</span>
            <span>View All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Notifications and Modals */}
      {notification && <Notification message={notification} />}
      {isReviewModalOpen && (
        <ReviewModal
          product={selectedProduct}
          onClose={handleCloseReviewModal}
          updateReviewCounts={updateReviewCounts}
          updateAverageRatings={updateAverageRatings}
          onSubmit={() => {}}
        />
      )}
    </section>
  );
}

export default Products;