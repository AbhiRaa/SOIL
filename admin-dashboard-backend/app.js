// const express = require('express');
// const cors = require('cors');
// const initDb = require('./src/database');
// const createServer = require('./src/graphql/index');

// const app = express();
// // Add CORS suport.
// app.use(cors());
// // Parse requests of content-type - application/json.
// app.use(express.json());

// // Define a function to initialize the application
// async function initializeApp() {
//     try {    
//       const db = await initDb();  // Ensure DB is initialized here
//       await db.sequelize.sync();  // Ensure DB is synced here
//       console.log('Database synced!');
        
//       // Integrate Apollo Server with Express using the models
//       const server = createServer(db.models); // Pass models to the server
//       server.applyMiddleware({ app });

//       // Define routes
//       app.get("/", (req, res) => {
//         res.json({ message: "Hello World from SOIL Organic Admin portal!" });
//       });
  
//     } catch (error) {
//       console.error('Failed to initialize the application:', error);
//     }
//   }

// // Start initializing app but do not listen here
// initializeApp();

// // Export the app for server.js to use
// module.exports = app;

const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');
const createServer = require('./src/graphql/index');

async function initializeApp() {
  const app = express();

  // Serve images, CSS files, JavaScript files, etc.
  app.use('/images', express.static('src/images'));

  // Add CORS suport.
  app.use(cors());

  // Parse requests of content-type - application/json.
  app.use(express.json());

  try {
    const db = await initDb();  // Ensure DB is initialized here
    await db.sequelize.sync();  // Ensure DB is synced here
    console.log('Database synced!');

    // Integrate Apollo Server with Express using the models
    const server = createServer(db.models); // Pass models to the server
    await server.start();  // Start Apollo Server before applying middleware
    server.applyMiddleware({ app });

    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic Admin portal!" });
    });

    return { app, server }; // Return both app and server
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    throw error;  // Errors are propagated
  }
}

module.exports = initializeApp;
