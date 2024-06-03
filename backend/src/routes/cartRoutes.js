module.exports = (app, db) => {
    const cartController = require('../controllers/cartController')(db);
    const authenticate = require('../middlewares/authenticate');

    // Retrieve the cart for a specific user
    app.get('/api/cart/:userId', authenticate, cartController.getCart);

    // Add an item to a user's cart
    app.post('/api/cart/add/:userId', authenticate, cartController.addItem);

    // Remove a specific item from the cart
    // app.delete('/api/cart/item/:userId', authenticate, cartController.removeItem);
    app.delete('/api/cart/item/:userId/:itemId', authenticate, cartController.removeItem);

    // Update the quantity of a specific item in the cart
    app.put('/api/cart/item/:userId', authenticate, cartController.updateItem);

    // Clear all items from a user's cart
    app.delete('/api/cart/clear/:userId', authenticate, cartController.clearCart);
};
