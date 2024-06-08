/**
 * pubsub.js
 * Provides a singleton instance of PubSub for managing subscriptions and broadcasting changes.
 *
 * This module leverages the `PubSub` class from the 'graphql-subscriptions' package,
 * enabling subscription-based real-time functionality throughout the application.
 * It allows components to subscribe to specific data changes and receive updates automatically,
 * facilitating a reactive user interface that responds to data changes in real time.
 */

const { PubSub } = require('graphql-subscriptions');

// Instantiate a new PubSub object
// The PubSub instance is used across the application to handle all GraphQL subscriptions.
const pubsub = new PubSub();

// Export the singleton PubSub instance to be used throughout the application.
module.exports = pubsub;
