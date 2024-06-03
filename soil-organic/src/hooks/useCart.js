/**
 * Provides a custom hook for managing shopping cart operations in a React application.
 *
 * This hook integrates with the UserContext to handle user-specific cart data, 
 * leveraging the browser's localStorage to persist cart items across sessions. 
 * It provides functionalities to add items to the cart, update item quantities, 
 * remove items, and clear the cart entirely.
 *
 * Usage:
 * 1. Import the hook into a React component.
 * 2. Call the hook to get access to cart functionalities and state.
 * 3. Use the provided methods to manipulate the cart's state.
 *
 * Example:
 * const { cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart } = useCart();
 *
 * @module useCart
 */
import { useState, useEffect, useContext } from 'react';
import UserContext from "../hooks/context";
import { getCart, addItem, removeItem, updateItem, clearCart as clearCartAPI } from "../services/cartService.js";

function useCart() {
    const { currentloggedInUser } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (currentloggedInUser && currentloggedInUser.userId) {
            getCart(currentloggedInUser.userId)
                .then(response => {
                    setCartItems(response.data.cartItems || []);
                })
                .catch(err => {
                    console.error("Failed to fetch cart items:", err);
                    setCartItems([]);
                });
        }
    }, [currentloggedInUser]);

    const addToCart = async (product, quantity) => {
        try {
            await addItem(currentloggedInUser.userId, product.product_id, quantity, product.product_price);
            setCartItems(prevItems => [...prevItems, { ...product, quantity }]);
        } catch (error) {
            console.error("Failed to add item:", error);
        }
    };

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            console.log(itemId)
            await updateItem(itemId, currentloggedInUser.userId, quantity);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.cart_item_id === itemId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error("Failed to update item quantity:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await removeItem(itemId, currentloggedInUser.userId);
            setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== itemId));
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const clearCart = async () => {
        try {
            // Call API to clear the cart
            await clearCartAPI(currentloggedInUser.userId);
            console.log("Clearing the cart...");
            setCartItems([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    return { cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart };
}

export default useCart;