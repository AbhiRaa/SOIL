const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub(); // Create a singleton PubSub instance

module.exports = pubsub;
