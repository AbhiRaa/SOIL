/**
 * config.server.js
 * Configuration settings for the server's operational parameters.
 *
 * This file centralizes configuration for the server, making it easier to manage
 * settings such as network ports and other operational parameters from one location.
 * This approach helps in maintaining consistency across different environments and
 * simplifies changes as the application scales.
 */

module.exports = {
    // The port number on which the server listens.
    // This can be overridden by setting an environment variable PORT before launching the server.
    PORT: 4001
  };