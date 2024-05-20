import React, { useContext, useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import Navigator from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import CheckoutModal from "../components/CheckoutModal";
import PurchaseSummaryModal from '../components/PurchaseSummaryModal';
import cartBackground from '../images/cartBackground.png';

function ShoppingCart() {
    const { currentloggedInUser } = useContext(UserContext);    // Access the context for the currently logged-in user
    const navigate = useNavigate();

    const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useCart();  // Custom hook to manage cart operations

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);    // State to control visibility of the checkout modal
    const [showSummaryModal, setShowSummaryModal] = useState(false);    // State to control visibility of the purchase summary modal

    // Redirect to signup if no user is logged in
    useEffect(() => {
        if (!currentloggedInUser) {
            navigate("/signin");
        }
    }, [currentloggedInUser, navigate]);


    // Function to increase the quantity of an item
    const increaseQuantity = (item) => {
        updateCartQuantity(item, 1);
    };

    // Function to decrease the quantity of an item
    const decreaseQuantity = (item) => {
        
        updateCartQuantity(item, -1);
    };

    // Handler to remove an item from the cart using its productId
    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    // Handler for initiating the checkout process
    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.product_price, 0);

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <Navigator />
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4">
                <img src = {cartBackground}  alt="Decorative" className="w-auto" />
            </div>
            {/* <div className="absolute top-0 righ-0 w-1/2 h-1/2 scale-x-[-1] transform -translate-x-30   translate-y-1/6 z-10">
                <img src = {cartBackground}  alt="Decorative" className="w-auto" />
            </div> */}
            <div className="flex justify-center">
                <h1 className="text-2xl font-bold mb-8 text-primary">Your shopping cart</h1>
            </div>
            <div className="container mx-auto  p-6 bg-white rounded-lg md:flex  justify-between border-2 border-primary shadow-2xl">
                
                <div className="mb-6 md:w-2/3 md:mr-6">
                    
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.product_id} className="mb-6 p-4 rounded border-primary border-2">
                                <div className="flex items-start">
                                    <img src={item.product_image} alt={item.product_name} className="w-24 h-24 object-cover mr-4" />
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold">{item.product_name}</h2>
                                            <p className="text-sm text-gray-600">{item.product_description}</p>
                                            <p className="text-sm">{item.product_quantity}</p>
                                            {/* ...other product details */}
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => decreaseQuantity(item)} className="text-lg px-2">-</button>
                                            <span className="text-lg mx-2">{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item)} className="text-lg px-2">+</button>
                                            <button onClick={() => handleRemoveItem(item.product_id)} className="ml-4 text-sm text-red-500">Remove</button>
                                        </div>
                                    </div>
                                    <span className="ml-auto text-lg font-bold">${item.product_price.toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    ) : <p>Your cart is empty.</p>}
                </div>
                {cartItems.length > 0 && (<div className="md:w-1/3">
                    <div className="p-4 rounded border-2 border-primary">
                        <h2 className="text-xl font-bold mb-6 text-primary">Summary</h2>
                        {/* <div className="flex justify-between mb-4">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div> */}
                        {/* ...other summary details */}
                        <div className="flex justify-between mb-4 font-bold">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span> {/* Update this to include other charges */}
                        </div>
                        <button onClick={handleCheckout} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Continue to checkout
                        </button>
                    </div>
                </div>)}
                <div className="absolute bottom-0 right-0 transform  rotate-180 -translate-x-1/5 -translate-y-1/5">
                {/* Assuming cartBackgroundBottomRight is imported and contains the URL for the bottom right image */}
                <img src={cartBackground} alt="Decorative" className="w-2/3" />
            </div>
            </div>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onCheckoutComplete={() => {
                    alert('Purchase successful! Thank you for your order.');
                    // clearCart();
                    setIsCheckoutOpen(false); // Close Checkout Modal
                    setShowSummaryModal(true); // Show Purchase Summary Modal
                }}
                cartItems={cartItems} // Pass current cart items to CheckoutModal
            />
            <PurchaseSummaryModal
                isOpen={showSummaryModal}
                onClose={() => {
                    clearCart();
                    setShowSummaryModal(false)}}
                purchaseDetails={{ items: cartItems }} // Ensure cartItems are updated correctly for summary
            />
        </div>
    );
}

export default ShoppingCart;