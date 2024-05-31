module.exports = (app, db) => {
    const productController = require('../controllers/productController')(db);  // Passing models to the controller
    const authenticate = require('../middlewares/authenticate');

    // Retrieve all products
    app.get('/api/products', authenticate, productController.getAllProducts);
}