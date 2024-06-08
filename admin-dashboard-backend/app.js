/**
 * app.js
 * Sets up the Express server integrated with Apollo Server for GraphQL API.
 * Configures middleware, database synchronization, and WebSocket for real-time communication.
 */
const express = require('express');
const cors = require('cors');
const initDb = require('./src/database');
const createApolloServer = require('./src/graphql/index');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const http = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

// Import type definitions and resolvers for GraphQL schema
const userSchema = require('./src/graphql/schemas/userSchema.js');
const productSchema = require('./src/graphql/schemas/productSchema.js');
const reviewSchema = require('./src/graphql/schemas/reviewSchema.js');
const userResolvers = require('./src/graphql/resolvers/userResolvers.js');
const productResolvers = require('./src/graphql/resolvers/productResolvers.js');
const reviewResolvers = require('./src/graphql/resolvers/reviewResolvers.js');

// Merge GraphQL schemas and resolvers
const typeDefs = mergeTypeDefs([userSchema, productSchema, reviewSchema]);
const resolvers = mergeResolvers([userResolvers, productResolvers, reviewResolvers]);

async function initializeApp() {
  const app = express();

  // Static middleware for serving images, CSS, and JavaScript files
  app.use('/images', express.static('src/images'));

  // CORS middleware to allow cross-origin requests
  app.use(cors());

  // Middleware to parse JSON requests
  app.use(express.json());

  try {
    // Initialize database and synchronize schemas
    const db = await initDb();
    await db.sequelize.sync();
    console.log('Database synced successfully.');

    // Create an HTTP server for the app
    const httpServer = http.createServer(app);

    // Setup WebSocket server for real-time GraphQL subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    // Apply GraphQL-WS to handle WebSocket connections
    const serverCleanup = useServer({ schema: makeExecutableSchema({ typeDefs, resolvers }) }, wsServer);

    // Integrate Apollo Server with Express using the models and handle proper dispose
    const apolloServer = createApolloServer(db.models, httpServer, () => serverCleanup.dispose());
    await apolloServer.start();  // Start Apollo Server before applying middleware
    apolloServer.applyMiddleware({ app });

    console.log(`WebSocket Server set up at path: ${apolloServer.graphqlPath}`);

    // Basic route for health check or API welcome
    app.get("/", (req, res) => {
      res.json({ message: "Hello World from SOIL Organic Admin portal!" });
    });

    return { app, httpServer, apolloServer, serverCleanup };
  } catch (error) {
    console.error('Initialization failed:', error);
    throw error;  // Rethrow to handle the error upstream
  }
}

module.exports = initializeApp;
