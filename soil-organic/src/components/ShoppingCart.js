import React from 'react';
import useCart from '../hooks/useCart';
import Navigator from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/context";
import { useContext } from "react";
import { useState } from "react";
import CheckoutModal from "../components/CheckoutModal";

function ShoppingCart() {
    const { currentloggedInUser } = useContext(UserContext);
    const navigate = useNavigate();

    const { cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart } = useCart();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Function to increase the quantity of an item
    const increaseQuantity = (item) => {
        // addToCart({ ...item, quantity: 1 });
        updateCartQuantity(item, 1);
    };

    // Function to decrease the quantity of an item
    const decreaseQuantity = (item) => {
        // if (item.quantity > 1) {
        //     addToCart({ ...item, quantity: -1 });
        // } else {
        //     removeFromCart(item.product_id);
        // }
        updateCartQuantity(item, -1);
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.product_price, 0);

    return (
        <div>
            <Navigator />
            <h2>Shopping Cart</h2>
            {cartItems.length > 0 ? (
                <ul>
                {cartItems.map(item => (
                    <li key={item.product_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img src={item.product_image} alt={item.product_name} style={{ width: '100px', marginRight: '20px' }} />
                        <div>
                            <h4>{item.product_name} - ${item.product_price.toFixed(2)}</h4>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button onClick={() => decreaseQuantity(item)}>-</button>
                                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item)}>+</button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => handleRemoveItem(item.product_id)} style={{ marginRight: '10px' }}>
                                    Remove
                                </button>
                                <p>Total: ${(item.quantity * item.product_price).toFixed(2)}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            ) : <p>Your cart is empty.</p>}
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Proceed to Checkout
            </button>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onCheckoutComplete={() => {
                    alert('Purchase successful! Thank you for your order.');
                    clearCart();
                    setIsCheckoutOpen(false);
                }}
                cartItems={cartItems} // Pass current cart items to CheckoutModal
            />
        </div>
    );
}

export default ShoppingCart;