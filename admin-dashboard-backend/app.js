const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');
const createApolloServer = require('./src/graphql/index');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const http = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

// Import type definitions and resolvers
const userSchema = require('./src/graphql/schemas/userSchema.js');
const productSchema = require('./src/graphql/schemas/productSchema.js');
const reviewSchema = require('./src/graphql/schemas/reviewSchema.js');
const userResolvers = require('./src/graphql/resolvers/userResolvers.js');
const productResolvers = require('./src/graphql/resolvers/productResolvers.js');
const reviewResolvers = require('./src/graphql/resolvers/reviewResolvers.js');

// Merge all schemas and resolvers
const typeDefs = mergeTypeDefs([userSchema, productSchema, reviewSchema]);
const resolvers = mergeResolvers([userResolvers, productResolvers, reviewResolvers]);

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

    // Create an HTTP server
    const httpServer = http.createServer(app);

    // Create a WebSocket server
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    // Use graphql-ws to handle WebSocket connections
    const serverCleanup = useServer({ schema: makeExecutableSchema({ typeDefs, resolvers }) }, wsServer);

    // Integrate Apollo Server with Express using the models and handle proper dispose
    const apolloServer = createApolloServer(db.models, httpServer, () => serverCleanup.dispose()); // Pass models to the server
    await apolloServer.start();  // Start Apollo Server before applying middleware
    apolloServer.applyMiddleware({ app });

    console.log(`WebSocket Server set up at path: ${apolloServer.graphqlPath}`);

    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic Admin portal!" });
    });

    return { app, httpServer, apolloServer, serverCleanup }; // Return both app and server  
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    throw error;  // Errors are propagated
  }
}

module.exports = initializeApp;
