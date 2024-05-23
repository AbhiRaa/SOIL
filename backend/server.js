// This file will set up and start your Express server.
const app = require('./app');

const PORT = process.env.PORT || 4000;

// Listen to the server here
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
