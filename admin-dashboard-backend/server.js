// This file will set up and start your Express server.
const initializeApp = require('./app');
const config = require('./src/config/config.server.js');
const { pollReviews, pollProductEngagement, pollProductStock } = require('./src/services/pollingService');

initializeApp().then(({ app, httpServer, apolloServer }) => {
  const PORT = config.PORT || 4001;

   // Listen to the server here
   httpServer.listen(PORT, () => {
    console.log(`Admin Server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`);
  });

  // Start the polling services
  pollReviews();
  pollProductEngagement();
  pollProductStock();

}).catch(error => {
  console.error('Failed to start the server:', error);
});
