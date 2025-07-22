import React, { useContext, useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import Navigator from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import CheckoutModal from "../components/CheckoutModal";
import PurchaseSummaryModal from '../components/PurchaseSummaryModal';
import cartBackground from '../images/cartBackground.png';
import Notification from '../utils/notifications';

function ShoppingCart() {
    const { currentloggedInUser } = useContext(UserContext);    // Access the context for the currently logged-in user
    const navigate = useNavigate();

    const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useCart();  // Custom hook to manage cart operations

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);    // State to control visibility of the checkout modal
    const [showSummaryModal, setShowSummaryModal] = useState(false);    // State to control visibility of the purchase summary modal

    const [shippingAddress, setShippingAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [notification, setNotification] = useState(''); // State for displaying notifications

    // Redirect to signup if no user is logged in
    useEffect(() => {
        if (!currentloggedInUser) {
            navigate("/signin");
        }
    }, [currentloggedInUser, navigate]);

    // Function to handle updates to shipping address and card number
    const handleShippingAddressChange = (address) => {
        setShippingAddress(address);
    };

    const handleCardNumberChange = (number) => {
        setCardNumber(number.slice(-4));  // Store only the last 4 digits
    };

    // Function to increase the quantity of an item
    const increaseQuantity = (item) => {
        updateCartQuantity(item.cart_item_id, item.quantity + 1);
    };

    // Function to decrease the quantity of an item
    const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateCartQuantity(item.cart_item_id, item.quantity - 1);
        } else {
            removeFromCart(item.cart_item_id);  // Remove the item if quantity goes to zero
        }
    };

    // Handler to remove an item from the cart using its productId
    const handleRemoveItem = (cart_item_id) => {
        removeFromCart(cart_item_id);
    };

    // Handler for initiating the checkout process
    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price_at_time, 0);

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
                            <div key={item.product.product_id} className="mb-6 p-4 rounded border-primary border-2">
                                <div className="flex items-start gap-2">
                                    <img src={"http://localhost:4000/"+item.product.product_image} alt={item.product.product_name} className="w-24 h-24 object-cover mr-4" />
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold">{item.product.product_name}</h2>
                                            <p className="text-sm text-gray-600">{item.product.product_description}</p>
                                            <p className="text-sm">{item.product.product_quantity}</p>
                                            {/* ...other product details */}
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => decreaseQuantity(item)} className="text-lg px-2">-</button>
                                            <span className="text-lg mx-2">{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item)} className="text-lg px-2">+</button>
                                            <button onClick={() => handleRemoveItem(item.cart_item_id)} className="ml-4 text-sm text-red-500">Remove</button>
                                        </div>
                                    </div>
                                    {item.product.is_special && <span className="text-white font-bold bg-green-500 rounded-md p-1">Special</span>}
                                    <span className="ml-auto text-lg font-bold">${parseFloat(item.price_at_time).toFixed(2)}</span>
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
                    setIsCheckoutOpen(false); // Close Checkout Modal
                    setShowSummaryModal(true); // Show Purchase Summary Modal
                }}
                cartItems={cartItems} // Pass current cart items to CheckoutModal
                updateShippingAddress={handleShippingAddressChange}
                updateCardNumber={handleCardNumberChange}
            />
            <PurchaseSummaryModal
                isOpen={showSummaryModal}
                onClose={() => {
                    clearCart();
                    setShowSummaryModal(false);

                    setNotification('Purchase successful! Thank you for your order.');
                    setTimeout(() => setNotification(''), 3000);
                }}
                purchaseDetails={{ 
                    items: cartItems,
                    shippingAddress: shippingAddress,
                    cardNumber: cardNumber.slice(-4)  // Only pass the last four digits
                }} 
            />
            {notification && <Notification message={notification} type="success" />}
        </div>
    );
}

export default ShoppingCart;