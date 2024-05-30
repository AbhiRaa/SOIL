// This file will set up and start your Express server.
const app = require('./app');
const config = require('./src/config/config.server.js');

const PORT = config.PORT || 4000;

// Listen to the server here
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
