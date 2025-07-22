import React, { useEffect,useContext } from 'react';
import useCart from '../hooks/useCart';
import UserContext from "../hooks/context";
import Notification from '../utils/notifications';
import '../index.css';
import ReviewModal from '../components/ReviewModal';
import StarRatings from 'react-star-ratings';
import { getAllPublicProducts, getAllSecureProducts } from "../services/productService"

/**
 * Renders a list of products that can be filtered by a topRatedLimit product by review .
 * It allows users to add products to a shopping cart.
 * 
 * @param {number} props.topRatedLimit - Top - X to filter products.
 */
function ProductList({ topRatedLimit }) {
    const { addToCart } = useCart();    // Hook to interact with the shopping cart
    const [products, setProducts] = React.useState([]); // Local state to store products
    let { currentloggedInUser } = useContext(UserContext);  // Context to access the currently logged-in user
    const [notification, setNotification] = React.useState(''); // State for displaying notifications
    const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [reviewCounts, setReviewCounts] = React.useState({}); // State to store review counts
    const [averageRatings, setAverageRatings] = React.useState({}); // State for average ratings

    // Effect to fetch products and apply rating filter
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = currentloggedInUser ? await getAllSecureProducts() : await getAllPublicProducts();

                // Calculate average ratings for Top Rated Products section
                const ratedProducts = response.data.map(product => {
                    const visibleReviews = product.reviews.filter(review => review.is_visible);
                    const averageRating = visibleReviews.reduce((acc, review) => acc + review.rating, 0) / (visibleReviews.length || 1);
                    return { ...product, averageRating };
                });
                if (topRatedLimit) {
                    ratedProducts.sort((a, b) => b.averageRating - a.averageRating);
                    ratedProducts.length = Math.min(ratedProducts.length, topRatedLimit);
                }
                setProducts(ratedProducts);
                setAverageRatings(ratedProducts.reduce((acc, product) => ({ ...acc, [product.product_id]: product.averageRating }), {}));


                // Calculate review counts and average ratings for Our Products page
                const counts = {};
                const averages = {};
                response.data.forEach(product => {
                    // Filter reviews to count only those that are visible  
                    const visibleReviews = product.reviews.filter(review => review.is_visible);
                    counts[product.product_id] = visibleReviews.length;

                    if (visibleReviews.length > 0) {
                        const totalRating = visibleReviews.reduce((acc, review) => acc + review.rating, 0);
                        averages[product.product_id] = totalRating / visibleReviews.length;
                    } else {
                        averages[product.product_id] = 0;
                    }
                }); 
                setReviewCounts(counts);
                setAverageRatings(averages);    
                
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setNotification('Failed to fetch products');
                setTimeout(() => setNotification(''), 3000);
            }
        }
        fetchProducts();

    }, [topRatedLimit, currentloggedInUser]);

    const updateReviewCounts = (productId, newCount) => {
        setReviewCounts(prevCounts => ({
            ...prevCounts,
            [productId]: newCount
        }));
    };
    
    const updateAverageRatings = (productId, newAverageRating) => {
        setAverageRatings(prevRatings => ({
            ...prevRatings,
            [productId]: newAverageRating
        }));
    };    

    /**
     * Handles adding a product to the cart.
     * @param {Object} product - Product to add to the cart.
     */
    const handleAddToCart = async (product) => {
        await addToCart(product,1);  // Set initial quantity to 1 when adding to cart
        setNotification(`Added ${product.product_name} to cart!`);
        setTimeout(() => setNotification(''), 3000);  // Clear notification after 3 seconds
    };

    const handleOpenReviewModal = (product) => {
        setSelectedProduct(product);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSubmitReview = ({ review, rating }) => {
        // Handle the review submission logic
        console.log(`Review for ${selectedProduct.product_name}: ${review}`);
        console.log(`Rating for ${selectedProduct.product_name}: ${rating} stars`);
    };

    return (
        <div className="w-full">
            {/* Products Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Featured <span className="text-green-400">Products</span>
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Hand-picked organic produce and artisanal goods for your healthy lifestyle
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <div 
                        key={product.product_id} 
                        className={`group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                            product.is_special ? 'ring-2 ring-green-400 shadow-green-400/20 shadow-lg' : ''
                        }`}
                    >
                        {/* Special Badge */}
                        {product.is_special && (
                            <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                🌟 Special
                            </div>
                        )}

                        {/* Product Image */}
                        <div className="relative overflow-hidden h-48">
                            <img 
                                src={"http://localhost:4000/"+product.product_image} 
                                alt={product.product_name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Product Content */}
                        <div className="p-6 space-y-4">
                            {/* Product Name & Price */}
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                                    {product.product_name}
                                </h3>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-green-400">
                                        ${parseFloat(product.product_price).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                                {product.product_description}
                            </p>

                            {/* Product Details */}
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Quantity:</span>
                                    <span className="font-medium text-white">{product.minimum_purchase_unit}</span>
                                </div>
                                
                                {/* Rating */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Rating:</span>
                                    <div className="flex items-center gap-2">
                                        <StarRatings
                                            rating={averageRatings[product.product_id]}
                                            starRatedColor="#fbbf24"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="16px"
                                            starSpacing="1px"
                                        />
                                        <span className="text-gray-300 text-xs">
                                            ({averageRatings[product.product_id]?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {currentloggedInUser && (
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    {product.product_stock === 0 ? (
                                        <div className="text-center py-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                                            <span className="text-red-300 font-bold text-sm">Out of Stock</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <span>🛒</span>
                                            <span>Add to Cart</span>
                                        </button>
                                    )}
                                    
                                    {/* Reviews Button */}
                                    <button 
                                        onClick={() => handleOpenReviewModal(product)} 
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
                                <div className="pt-4 border-t border-white/10">
                                    <div className="text-center py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-blue-300 text-sm font-medium mb-2">Sign in to purchase</p>
                                        <a 
                                            href="/signin" 
                                            className="text-blue-400 hover:text-blue-300 underline text-sm font-semibold"
                                        >
                                            Sign In Now
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Empty State */}
            {products.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🥬</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Products Available</h3>
                    <p className="text-gray-400">We're currently updating our inventory. Check back soon!</p>
                </div>
            )}
            
            {/* Notifications and Modals */}
            {notification && (
                <Notification 
                    message={notification} 
                    type={notification.includes('Failed') ? 'error' : 'success'}
                />
            )}
            {isReviewModalOpen && (
                <ReviewModal
                    product={selectedProduct}
                    onClose={handleCloseReviewModal}
                    updateReviewCounts={updateReviewCounts}
                    updateAverageRatings={updateAverageRatings}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
}

export default ProductList;