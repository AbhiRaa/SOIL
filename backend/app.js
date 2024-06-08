/**
 * This module sets up the core Express application for the SOIL Organic platform.
 * It initializes the database, configures middleware, and sets up routes. This
 * module is responsible for initializing the application environment, configuring middleware,
 * static files, CORS settings, JSON parsing, and database seeding if necessary.
 * 
 * @module app
 */

const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');
const { errorHandler } = require('./src/middlewares/errorHandler');
const {products} = require('./src/database/productsData')

const app = express();

// Middleware to serve static images
app.use('/images', express.static('src/database/images'));

// CORS middleware to allow cross-origin requests
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Initializes the application by setting up the database and routes.
 * Logs errors and starts the database synchronization.
 */
async function initializeApp() {
  try {    
    const db = await initDb();  // Initialize the database
    await db.sequelize.sync();  // Synchronize the database schema
    console.log('Database synced!');

    // Optionally seed the database with initial data if it's empty
    await seedProductsIfNeeded(db.models.Product);

    // Define Global Hello route
    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic!" });
    });

    // Set up application routes
    setupRoutes(db);

    // Global error handler
    app.use(errorHandler);

  } catch (error) {
    console.error('Failed to initialize the application:', error);
  }
}

/**
 * Seeds the database with predefined products.
 * @param {Model} Product - The Product model that will receive the data.
 */
async function seedProducts(Product) {
  try {
    await Product.bulkCreate(products, { validate: true });
    console.log('Products have been added successfully!');
  } catch (error) {
    console.error('Failed to seed products:', error);
  }
}

/**
 * Seeds the database with product data if the products table is empty.
 * @param {Model} Product - The Product model to which the data will be seeded.
 */
async function seedProductsIfNeeded(Product) {
  const existingCount = await Product.count();
  if (existingCount === 0) {
    console.log('No products found, seeding...');
    await seedProducts(Product);
  } else {
    console.log('Products already seeded');
  }
}

/**
 * Configures application routes.
 * @param {object} db - The database object that contains models.
 */
function setupRoutes(db) {
  const setupUserRoutes = require('./src/routes/userRoutes');
  setupUserRoutes(app, db); // Inject database into user routes

  const setupProductRoutes = require('./src/routes/productRoutes');
  setupProductRoutes(app, db); // Inject database into product routes

  const setupReviewRoutes = require('./src/routes/reviewRoutes');
  setupReviewRoutes(app, db); // Inject database into review routes

  const setupCartRoutes = require('./src/routes/cartRoutes');
  setupCartRoutes(app, db); // Inject database into cart routes
}

// Initialize the application without starting the HTTP server
initializeApp();

// Export the configured app to be used by the server.js module
module.exports = app;