module.exports = (app, db) => {
    const productController = require('../controllers/productController')(db);  // Passing models to the controller
    const authenticate = require('../middlewares/authenticate');

    // Retrieve all products
    app.get('/api/secure/products', authenticate, productController.getAllProducts);

    //retrieve all products when not signed in
    app.get('/api/public/products', productController.getAllProducts);
}