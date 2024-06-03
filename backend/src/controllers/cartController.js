module.exports = (db) => {
    const { Cart, CartItem, Product } = db.models;
    
    const updateCartTotal = async (cartId) => {
        const cartItems = await CartItem.findAll({
            where: { cart_id: cartId },
            include: [{ model: Product, as: 'product' }]
        });

        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price_at_time), 0);
        await Cart.update({ total, updated_at: new Date() }, { where: { cart_id: cartId } });
    };

    return {
        // Retrieve cart with items and associated product details
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
                    return res.status(404).json({ message: 'Cart not found' });
                }

                res.json(cart);
            } catch (error) {
                res.status(500).json({ message: 'Error retrieving cart', error });
            }
        },

        // Add item to cart
        addItem: async (req, res) => {
            const { productId, quantity, price } = req.body;
            const { userId } = req.params;

            try {
                let cart = await Cart.findOrCreate({
                    where: { user_id: userId }
                });

                const [item, created] = await CartItem.findOrCreate({
                    where: { cart_id: cart[0].cart_id, product_id: productId },
                    defaults: { quantity, price_at_time: price }
                });

                if (!created) {
                    item.quantity += quantity;
                    await item.save();
                }

                await updateCartTotal(cart[0].cart_id);
                res.status(201).json({ message: 'Item added successfully', item });
            } catch (error) {
                res.status(500).json({ message: 'Error adding item to cart', error });
            }
        },

        // Remove item from cart
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
                res.status(500).json({ message: 'Error removing item from cart', error });
            }
        },

         // Update item quantity
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
                res.status(500).json({ message: 'Error updating item', error });
            }
        },

        // Clear all items from a user's cart
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
                    const newStock = item.product.product_stock - item.quantity;
                    await Product.update({ product_stock: newStock }, { where: { product_id: item.product_id } });
                }));

                await CartItem.destroy({ where: { cart_id: cart.cart_id } });
                await updateCartTotal(cart.cart_id); // Reset total after clearing items

                res.json({ message: 'Cart cleared successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error clearing cart', error });
            }
        }
    };
};