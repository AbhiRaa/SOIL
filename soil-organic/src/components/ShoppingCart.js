import React, { useContext, useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import Navigator from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import CheckoutModal from "../components/CheckoutModal";
import PurchaseSummaryModal from '../components/PurchaseSummaryModal';
import Notification from '../utils/notifications';

/**
 * Enhanced ShoppingCart Component with Premium Dark Theme
 * Features a sophisticated design matching the app's UI with glass morphism and modern styling
 */
function ShoppingCart() {
    const { currentloggedInUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useCart();
    
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [notification, setNotification] = useState('');

    // Redirect to signin if no user is logged in
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
        setCardNumber(number.slice(-4));
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
            removeFromCart(item.cart_item_id);
        }
    };

    // Handler to remove an item from the cart
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 right-10 w-4 h-4 bg-green-300/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 left-16 w-6 h-6 bg-white/20 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-32 right-20 w-3 h-3 bg-green-400/40 rounded-full animate-pulse animation-delay-1000"></div>

            {/* Navigation */}
            {!isCheckoutOpen && !showSummaryModal && (
                <div className="relative z-20">
                    <Navigator />
                </div>
            )}

            {/* Main Content */}
            <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isCheckoutOpen || showSummaryModal ? 'pt-20' : ''}`}>
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-400/20 rounded-full mb-6">
                        <span className="text-3xl">🛒</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Shopping <span className="text-green-400">Cart</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-6"></div>
                    <p className="text-gray-300 text-lg">
                        {cartItems.length > 0 
                            ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart`
                            : 'Your cart is waiting for some organic goodness'
                        }
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item, index) => (
                                <div 
                                    key={item.product.product_id} 
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Product Image */}
                                        <div className="relative">
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-white/20">
                                                <img 
                                                    src={`http://localhost:4000/${item.product.product_image}`} 
                                                    alt={item.product.product_name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {item.product.is_special && (
                                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                    Special
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-bold text-white">{item.product.product_name}</h3>
                                            <p className="text-gray-300 text-sm line-clamp-2">{item.product.product_description}</p>
                                            <p className="text-green-400 text-sm font-medium">{item.product.product_quantity}</p>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                                                    <button 
                                                        onClick={() => decreaseQuantity(item)}
                                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => increaseQuantity(item)}
                                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleRemoveItem(item.cart_item_id)}
                                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-400">
                                                ${parseFloat(item.price_at_time * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                ${parseFloat(item.price_at_time).toFixed(2)} each
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                                    {/* Summary Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                                            <span className="text-xl">📋</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                                            <p className="text-gray-400 text-sm">Review your items</p>
                                        </div>
                                    </div>

                                    {/* Summary Details */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-300">
                                            <span>Subtotal ({cartItems.length} items)</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Shipping</span>
                                            <span className="text-green-400 font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Tax</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="border-t border-white/20 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-white">Total</span>
                                                <span className="text-2xl font-bold text-green-400">
                                                    ${totalPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                                    >
                                        <span className="text-xl">🚀</span>
                                        <span>Proceed to Checkout</span>
                                    </button>

                                    {/* Security Badge */}
                                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Secure Checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="text-center py-16">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 shadow-2xl max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🛒</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h3>
                            <p className="text-gray-400 mb-8">
                                Looks like you haven't added any organic products yet. 
                                Start shopping to fill your cart with fresh, healthy options!
                            </p>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onCheckoutComplete={() => {
                    setIsCheckoutOpen(false);
                    setShowSummaryModal(true);
                }}
                cartItems={cartItems}
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
                    cardNumber: cardNumber.slice(-4)
                }} 
            />
            
            {/* Footer */}
            {!isCheckoutOpen && !showSummaryModal && (
                <div className="relative z-30">
                    <Footer />
                </div>
            )}
            
            {notification && <Notification message={notification} type="success" />}
        </div>
    );
}

export default ShoppingCart;