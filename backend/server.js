/**
 * This module initializes and starts the Express server for the SOIL Organic application.
 * It imports the Express app configuration from the `app.js` module and listens on a specified port.
 * The port number is retrieved from environment-specific configuration settings, ensuring flexibility and configurability.
 *
 * @module server
 */
// Import the configured Express app
const app = require('./app');
// Import server configuration settings, including the port number
const config = require('./src/config/config.server.js');

// Set the default port from configuration or use 4000 if not specified
const PORT = config.PORT || 4000;

// Start the server and listen on the configured port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
