import React, { useEffect,useContext } from 'react';
import { initProducts, getProducts } from '../data/products';
import useCart from '../hooks/useCart';
import UserContext from "../hooks/context";
import Notification from '../utils/notifications';
import '../index.css';
import ReviewModal from '../components/ReviewModal';
import StarRatings from 'react-star-ratings';


/**
 * Renders a list of products that can be filtered by a minimum rating.
 * It allows users to add products to a shopping cart.
 * 
 * @param {Object} props - Component props
 * @param {number} props.filterRating - Minimum rating to filter products.
 */
function ProductList({filterRating}) {
    const { addToCart } = useCart();    // Hook to interact with the shopping cart
    const [products, setProducts] = React.useState([]); // Local state to store products
    let { currentloggedInUser } = useContext(UserContext);  // Context to access the currently logged-in user
    const [notification, setNotification] = React.useState(''); // State for displaying notifications
    const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [reviewCounts, setReviewCounts] = React.useState({}); // State to store review counts


    // Effect to fetch products and apply rating filter
    useEffect(() => {
        initProducts();  // Initialize products in local storage if not already initialized
        setProducts(getProducts());  // Load products from local storage into state
        let fetchedProducts = getProducts();
        if(filterRating){
            // Apply the rating filter if specified
            fetchedProducts = fetchedProducts.filter(product => product.product_rating > filterRating);
        }
        setProducts(fetchedProducts);

        // Fetch review counts for each product
        // const counts = {};
        // fetchedProducts.forEach(product => {
        //     const reviews = getReviewsForProduct(product.product_id);
        //     counts[product.product_id] = reviews.length;
        // });
        // setReviewCounts(counts);


    }, [filterRating]);

    /**
     * Handles adding a product to the cart.
     * @param {Object} product - Product to add to the cart.
     */
    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            quantity: 1  // Set initial quantity to 1 when adding to cart
        });
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
        // Handle the review submission logic here (e.g., save it to the database or state)
        console.log(`Review for ${selectedProduct.product_name}: ${review}`);
        console.log(`Rating for ${selectedProduct.product_name}: ${rating} stars`);
    };

    return (
            <div className="flex flex-wrap justify-center">
                {products.map(product => (
                    <div key={product.product_id} className={`border-2 text-orange-600 rounded-lg p-4 m-4 w-64 shadow-lg ${product.is_special ? 'border-special-green shadow-special-glow animate-glow-fade' : 'border-teal-300'}`}>
                         {product.is_special && <h2 className="text-lg font-bold text-green-500 text-center mb-2"> This week's Specials!</h2>}
                        <img src={product.product_image} alt={product.product_name} className="w-full h-40 object-cover rounded-t-lg"/>
                        <h3 className="text-lg font-bold" >{product.product_name}</h3>
                        <h3 className="text-lg font-bold"> ${product.product_price.toFixed(2)}</h3>
                        <p className="text-md text-primary">{product.product_description}</p>
                        <p className="text-md font-bold">Quantity: {product.product_quantity}</p>
                        <p className="text-md font-bold">Rating:<span> <StarRatings
                            rating={product.product_rating}
                            starRatedColor="gold"
                            // changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                            starDimension="15px"
                            starSpacing="0.01px"
                        /></span></p>
                        

                        {currentloggedInUser && (
                        <>
                        <div className='flex gap-5'>
                            <button onClick={() => handleAddToCart(product)} className="mt-4  hover:bg-teal-300 text-primary font-bold py-2 px-4 rounded-lg border border-primary">
                            Add to cart
                            </button>
                            <button onClick={() => handleOpenReviewModal(product)} className="mt-4 text-primary underline font-bold py-2">
                            {reviewCounts[product.product_id] ? `${reviewCounts[product.product_id]} reviews` : 'No reviews'}
                            </button>
                        </div>
                        </>
                        
                    )}
                </div>
            ))}
            {notification && <Notification message={notification} />}
            {isReviewModalOpen && (
                <ReviewModal
                    product={selectedProduct}
                    onClose={handleCloseReviewModal}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
}

export default ProductList;