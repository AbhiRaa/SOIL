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

// Export a function that takes models as an argument and returns the Apollo Server instance
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
                await onCleanup();
              }
            };
          }
        }
      ]
  });
};