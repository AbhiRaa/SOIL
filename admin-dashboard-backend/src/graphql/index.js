/**
 * graphql/index.js
 * 
 * Configures and exports the Apollo Server instance. This file is responsible for
 * merging GraphQL type definitions (schemas) and resolvers, and integrating these
 * with the Apollo Server. It also sets up server lifecycle plugins to handle server
 * events such as shutdown.
 */

const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

// Import type definitions and resolvers
const userSchema = require('./schemas/userSchema.js');
const productSchema = require('./schemas/productSchema.js');
const reviewSchema = require('./schemas/reviewSchema.js');
const userResolvers = require('./resolvers/userResolvers.js');
const productResolvers = require('./resolvers/productResolvers.js');
const reviewResolvers = require('./resolvers/reviewResolvers.js');

// Merge all schemas and resolvers
const typeDefs = mergeTypeDefs([userSchema, productSchema, reviewSchema]);
const resolvers = mergeResolvers([userResolvers, productResolvers, reviewResolvers]);

/**
 * Creates and returns an Apollo Server instance configured with schema, context, and server plugins.
 * 
 * @param {Object} models - The models object for accessing the database via Sequelize.
 * @param {Object} httpServer - The HTTP server on which Apollo Server will be mounted.
 * @param {Function} onCleanup - A cleanup function to be called when the server is shutting down.
 * @returns {ApolloServer} An instance of ApolloServer configured for the application.
 */
module.exports = (models, httpServer, onCleanup) => {
  // Create executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return new ApolloServer({
      schema,
      context: ({ req }) => {
          const user = req.headers.user ? JSON.parse(req.headers.user) : null;
          return { user, models };
      },
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                // Perform any custom cleanup such as disposing of web socket connections
                try {
                  await onCleanup();
                } catch (error) {
                  console.error('Error during server shutdown:', error);
                }
              }
            };
          }
        }
      ]
  });
};