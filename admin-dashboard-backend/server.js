/**
 * server.js
 * Entry point for the admin-dashboard-backend server.
 * Configures and starts an HTTP server with integrated Apollo Server for GraphQL.
 * Also initiates scheduled polling services to fetch and propagate data updates.
 */
const initializeApp = require('./app');
const config = require('./src/config/config.server.js');
const { pollReviews, pollProductEngagement, pollProductStock } = require('./src/services/pollingService');

// Initialize the application and start the server
initializeApp().then(({ app, httpServer, apolloServer }) => {
  const PORT = config.PORT || 4001;

   // Start listening on the configured port
   httpServer.listen(PORT, () => {
    console.log(`Admin Server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`);
  });

  // Start polling services for live data updates
  try {
    pollReviews();
    pollProductEngagement();
    pollProductStock();
  } catch (pollingError) {
    console.error('Error starting polling services:', pollingError);
  }

}).catch(error => {
  console.error('Failed to start the server:', error);
});
