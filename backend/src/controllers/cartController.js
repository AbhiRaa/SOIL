/**
 * Cart Controller for managing the shopping cart operations in the SOIL Organic backend application.
 * This controller includes functions to manage cart items such as adding, updating, removing, and clearing the cart.
 * It also handles retrieving the cart with detailed product information.
 *
 * @module CartController
 */

module.exports = (db) => {
    const { Cart, CartItem, Product } = db.models;
    
     /**
     * Updates the total amount in the cart by summing up the price of all items in the cart.
     * @param {number} cartId - The ID of the cart to be updated.
     */
    const updateCartTotal = async (cartId) => {
        try {
            const cartItems = await CartItem.findAll({
                where: { cart_id: cartId },
                include: [{ model: Product, as: 'product' }]
            });
    
            if (!cartItems || cartItems.length === 0) {
                console.log('No items found in cart:', cartId);
                return;
            }
    
            const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price_at_time), 0);
            await Cart.update({ total, updated_at: new Date() }, { where: { cart_id: cartId } });
        } catch (error) {
            console.error('Error updating cart total:', error);
        }
    };
    
    return {
        /**
         * Retrieves the cart for a specific user, including the items and their associated products.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         */
        getCart: async (req, res) => {
            try {
                const { userId } = req.params;
                const cart = await Cart.findOne({
                    where: { user_id: userId },
                    include: [{
                        model: CartItem,
                        as: 'cartItems',
                        include: [{
                            model: Product,
                            as: 'product'
                        }]
                    }]
                });

                if (!cart) {
                    console.log('No cart found for user:', userId);
                    return res.status(404).json({ message: 'Cart not found' });
                }

                console.log('Cart found:', cart);
                res.json(cart);
            } catch (error) {
                console.error('Failed to retrieve cart:', error);
                res.status(500).json({ message: 'Error retrieving cart', error: error.message });
            }
        },

        /**
         * Adds an item to the cart or updates the quantity if it already exists.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         */
        addItem: async (req, res) => {
            const { userId } = req.params;
            const { productId, quantity, price } = req.body;
        
            try {
                let [cart, created] = await Cart.findOrCreate({
                    where: { user_id: userId },
                    defaults: { user_id: userId, total: 0 }
                });
        
                if (!cart) {
                    console.log('Failed to find or create cart for user:', userId);
                    return res.status(500).json({ message: 'Failed to create cart' });
                }
        
                const [item, itemCreated] = await CartItem.findOrCreate({
                    where: { cart_id: cart.cart_id, product_id: productId },
                    defaults: { quantity, price_at_time: price }
                });
        
                if (!itemCreated) {
                    item.quantity += quantity;
                    await item.save();
                }

                if (!cart || !item) {
                    console.error('Cart or item not found/created:', { cart, item });
                    res.status(500).json({ message: 'Failed to handle cart or item correctly' });
                    return;
                }                
        
                await updateCartTotal(cart.cart_id);
                console.log('Item added successfully:', item);
                res.status(201).json({ message: 'Item added successfully', item });
            } catch (error) {
                console.error('Failed to add item:', error);
                res.status(500).json({ message: 'Error adding item to cart', error: error.message });
            }
        },

        /**
         * Removes an item from the cart.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         */
        removeItem: async (req, res) => {
            const { userId, itemId } = req.params;
            
            try {
                const cart = await Cart.findOne({ where: { user_id: userId } });
                if (!cart) {
                    return res.status(404).json({ message: 'Cart not found' });
                }
                const result = await CartItem.destroy({
                    where: { cart_item_id: itemId, cart_id: cart.cart_id }
                });

                if (result === 0) {
                    return res.status(404).json({ message: 'Item not found or not in your cart' });
                }

                await updateCartTotal(cart.cart_id);
                res.json({ message: 'Item removed successfully' });
            } catch (error) {
                console.error('Error removing item from cart:', error);
                res.status(500).json({ message: 'Error removing item from cart', error });
            }
        },

        /**
         * Updates the quantity of an item in the cart.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
        */
        updateItem: async (req, res) => {
            const { itemId, quantity } = req.body;
            const { userId } = req.params;

            try {
                const cart = await Cart.findOne({ where: { user_id: userId } });

                const item = await CartItem.findOne({
                    where: { cart_item_id: itemId, cart_id: cart.cart_id }
                });

                if (!item) {
                    return res.status(404).json({ message: 'Item not found' });
                }

                item.quantity = quantity;
                await item.save();

                await updateCartTotal(cart.cart_id);
                res.json({ message: 'Item updated successfully', item });
            } catch (error) {
                console.error('Error updating item:', error);
                res.status(500).json({ message: 'Error updating item', error });
            }
        },

        /**
         * Clears all items from a user's cart, resetting the cart to empty.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         */
        clearCart: async (req, res) => {
            const { userId } = req.params;

            try {
                const cart = await Cart.findOne({ where: { user_id: userId } });
                if (!cart) {
                    return res.status(404).json({ message: 'Cart not found' });
                }

                // Adjust product stock by decreasing it according to the quantities in the cart
                const cartItems = await CartItem.findAll({
                    where: { cart_id: cart.cart_id },
                    include: [{ model: Product, as: 'product' }]
                });

                await Promise.all(cartItems.map(async item => {
                    // Calculate new stock value
                    const newStock = item.product.product_stock - item.quantity;
                    
                    // Update stock only if newStock is non-negative
                    if (newStock >= 0) {
                        await Product.update({ product_stock: newStock }, { where: { product_id: item.product_id } });
                    } else {
                        // Optionally, log or handle the case when stock cannot be reduced
                        console.log(`Cannot reduce stock for product ${item.product_id}: stock would become negative.`);
                    }
                }));

                await CartItem.destroy({ where: { cart_id: cart.cart_id } });
                await updateCartTotal(cart.cart_id); // Reset total after clearing items

                res.json({ message: 'Cart cleared successfully' });
            } catch (error) {
                console.error('Error clearing cart:', error);
                res.status(500).json({ message: 'Error clearing cart', error });
            }
        }
    };
};