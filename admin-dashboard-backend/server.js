// // This file will set up and start your Express server.
// const app = require('./app');
// const config = require('./src/config/config.server.js');

// const PORT = config.PORT || 5001;

// // Listen to the server here
// app.listen(PORT, () => {
//   console.log(`Admin Server running on http://localhost:${PORT}${server.graphqlPath}`);
// });

// This file will set up and start your Express server.
const initializeApp = require('./app');
const config = require('./src/config/config.server.js');

initializeApp().then(({ app, server }) => {
  const PORT = config.PORT || 4001;
  
  // Listen to the server here
  app.listen(PORT, () => {
    console.log(`Admin Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
});
