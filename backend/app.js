// This is the main Express application file.
const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');
const { errorHandler } = require('./src/middlewares/errorHandler');
const {products} = require('./src/database/productsData')
// const userRoutes = require('./src/routes/userRoutes');

const app = express();


// Serve images, CSS files, JavaScript files, etc.
app.use('/images', express.static('src/database/images'));

// Add CORS suport.
app.use(cors());
// Parse requests of content-type - application/json.
app.use(express.json());

// Define a function to initialize the application
async function initializeApp() {
  try {    
    const db = await initDb();  // Ensure DB is initialized here
    await db.sequelize.sync();  // Ensure DB is synced here
    const Product = db.models.Product
    await seedProductsIfNeeded(Product); //seed products if table is empty
    console.log('Database synced!');

    // Define routes
    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic!" });
    });

    // All other routes setup
    // Importing the routes function and passing db models to it
    const setupUserRoutes = require('./src/routes/userRoutes');
    setupUserRoutes(app, db); // Dependency injection of models

    const setupProductRoutes = require('./src/routes/productRoutes');
    setupProductRoutes(app, db); // Dependency injection of models
    
    // // Routes
    // app.get('/', (req, res) => {
    //   throw new Error('Something broke!'); // for errorHandler
    // });

    app.use(errorHandler);

  } catch (error) {
    console.error('Failed to initialize the application:', error);
  }
}


async function seedProducts(Product) {
  try {
    await Product.bulkCreate(products, { validate: true });
    console.log('Products have been added successfully!');
  } catch (error) {
    console.error('Failed to seed products:', error);
  }
}

async function seedProductsIfNeeded(Product) {
  const existingCount = await Product.count();
  if (existingCount === 0) {
    console.log('No products found, seeding...');
    await seedProducts(Product);
  } else {
    console.log('Products already seeded');
  }
}


// Start initializing app but do not listen here
initializeApp();

// Export the app for server.js to use
module.exports = app;