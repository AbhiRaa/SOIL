const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

// Import type definitions and resolvers
const userSchema = require('./schemas/userSchema');
const productSchema = require('./schemas/productSchema');
const reviewSchema = require('./schemas/reviewSchema');
const userResolvers = require('./resolvers/userResolvers');
const productResolvers = require('./resolvers/productResolvers');
const reviewResolvers = require('./resolvers/reviewResolvers');

// Merge all schemas and resolvers
const typeDefs = mergeTypeDefs([userSchema, productSchema, reviewSchema]);
const resolvers = mergeResolvers([userResolvers, productResolvers, reviewResolvers]);

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// // Create an instance of ApolloServer
// const server = new ApolloServer({
//   schema,
//   context: ({ req }) => {
//     // You can add authentication logic here to pass user info to resolvers
//     const user = req.headers.user ? JSON.parse(req.headers.user) : null;
//     return { user };
//   }
// });

// module.exports = server;

// Export a function that takes models as an argument and returns the Apollo Server instance
module.exports = (models) => {
    return new ApolloServer({
      schema,
      context: ({ req }) => {
        // You can add authentication logic here to pass user info to resolvers
        const user = req.headers.user ? JSON.parse(req.headers.user) : null;
        return { user, models }; // Pass models here so that it can be used in all resolvers
      }
    });
  };