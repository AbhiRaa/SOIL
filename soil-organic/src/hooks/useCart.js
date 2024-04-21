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

function useCart() {
    const { currentloggedInUser } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const userCartKey = `cartItems_${currentloggedInUser}`;  // Suffix the cart key with the user's email
        const items = JSON.parse(localStorage.getItem(userCartKey)) || [];
        setCartItems(items);
    }, [currentloggedInUser]);

    const saveCartItems = (items) => {
        const userCartKey = `cartItems_${currentloggedInUser}`;
        localStorage.setItem(userCartKey, JSON.stringify(items));
        setCartItems(items);
    };

    const addToCart = (item) => {
        const existingIndex = cartItems.findIndex(cartItem => cartItem.product_id === item.product_id);

        let newCartItems;
        if (existingIndex >= 0) {
            // If item exists, update the quantity
            newCartItems = [...cartItems];
            newCartItems[existingIndex] = {
                ...newCartItems[existingIndex],
                quantity: newCartItems[existingIndex].quantity + 1
            };
        } else {
            // If item does not exist, add it
            newCartItems = [...cartItems, { ...item, quantity: 1 }];
        }
        saveCartItems(newCartItems);
    };

    const updateCartQuantity = (item, deltaQuantity) => {
        const existingIndex = cartItems.findIndex(cartItem => cartItem.product_id === item.product_id);

        let newCartItems;
        if (existingIndex >= 0) {
            // If item exists, update the quantity
            const newQuantity = cartItems[existingIndex].quantity + deltaQuantity;
            if (newQuantity > 0) {
                newCartItems = [...cartItems];
                newCartItems[existingIndex] = {
                    ...newCartItems[existingIndex],
                    quantity: newQuantity
                };
            } else {
                // Remove the item if the quantity falls to zero or below
                newCartItems = cartItems.filter((_, index) => index !== existingIndex);
            }
        } else if (deltaQuantity > 0) {
            // If item does not exist and delta is positive, add it
            newCartItems = [...cartItems, { ...item, quantity: deltaQuantity }];
        } else {
            // If deltaQuantity is negative and item does not exist, do nothing
            return;
        }
        saveCartItems(newCartItems);
    };

    const removeFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.product_id !== itemId);
        saveCartItems(updatedCartItems);
    };

    const clearCart = () => {
        const userCartKey = `cartItems_${currentloggedInUser}`;
        localStorage.removeItem(userCartKey);
        setCartItems([]);
    };

    return { cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart };
}

export default useCart;