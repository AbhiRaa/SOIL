import { useState, useEffect } from 'react';

const CART_ITEMS_KEY = 'cartItems';

function useCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(CART_ITEMS_KEY)) || [];
        setCartItems(items);
    }, []);

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

        setCartItems(newCartItems);
        localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(newCartItems));
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

        setCartItems(newCartItems);
        localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(newCartItems));
    };

    const removeFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.product_id !== itemId);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const clearCart = () => {
        localStorage.removeItem(CART_ITEMS_KEY);
        setCartItems([]);
    };

    return { cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart };
}

export default useCart;