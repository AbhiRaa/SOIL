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
            <div className="flex flex-wrap justify-center">
                {products.map(product => (
                    <div key={product.product_id} className={`border-2 text-orange-600 rounded-lg p-4 m-4 w-64 shadow-lg ${product.is_special ? 'border-special-green shadow-special-glow animate-glow-fade' : 'border-teal-300'}`}>
                         {product.is_special && <h2 className="text-lg font-bold text-green-500 text-center mb-2"> This week's Specials!</h2>}
                        <img src={"http://localhost:4000/"+product.product_image} alt={product.product_name} className="w-full h-40 object-cover rounded-t-lg"/>
                        <h3 className="text-lg font-bold" >{product.product_name}</h3>
                        <h3 className="text-lg font-bold"> ${parseFloat(product.product_price).toFixed(2)}</h3>
                        <p className="text-md text-primary">{product.product_description}</p>
                        <p className="text-md font-bold">Quantity: {product.minimum_purchase_unit}</p>
                        <p className="text-md font-bold">Rating:<span> <StarRatings
                            rating={averageRatings[product.product_id]}
                            starRatedColor="gold"
                            // changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                            starDimension="15px"
                            starSpacing="0.01px"
                        /></span></p>
                        {currentloggedInUser && (
                        <div className='flex gap-5 items-center'>
                            {product.product_stock === 0 ? (
                                <span className="mt-4 text-red-500 font-bold">Out of Stock</span>
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-4 hover:bg-teal-300 text-primary font-bold py-2 px-4 rounded-lg border border-primary"
                                >
                                    Add to cart
                                </button>
                            )}
                            <button onClick={() => handleOpenReviewModal(product)} className="mt-4 text-primary underline font-bold py-2">
                            {reviewCounts[product.product_id] ? `${reviewCounts[product.product_id]} reviews` : 'No reviews'}
                            </button>
                        </div>
                    )} 
                    
                </div>
            ))}
            {notification && <Notification message={notification} />}
            {isReviewModalOpen && (
                <ReviewModal
                    product={selectedProduct}
                    onClose={handleCloseReviewModal}
                    updateReviewCounts={updateReviewCounts} // Pass the update function as a prop for review counts
                    updateAverageRatings={updateAverageRatings} // Pass the update function as a prop for avg ratings
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
}

export default ProductList;