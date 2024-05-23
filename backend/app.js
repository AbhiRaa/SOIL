// This is the main Express application file.
const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');

const app = express();

// Add CORS suport.
app.use(cors());
// Parse requests of content-type - application/json.
app.use(express.json());

// Define a function to initialize the application
async function initializeApp() {
  try {
    const db = await initDb();  // Ensure DB is initialized here
    await db.sequelize.sync();  // Ensure DB is synced here
    console.log('Database synced!');

    // Define routes
    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic!" });
    });

    // Add other routes setup
    // require("./src/routes/user.routes.js")(app);

  } catch (error) {
    console.error('Failed to initialize the application:', error);
  }
}

// Start initializing app but do not listen here
initializeApp();

// Export the app for server.js to use
module.exports = app;