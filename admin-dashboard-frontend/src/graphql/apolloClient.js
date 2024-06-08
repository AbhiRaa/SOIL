/**
 * This module configures the Apollo Client for interfacing with the GraphQL server.
 * It sets up both HTTP and WebSocket connections to enable real-time data fetching
 * and operations via subscriptions alongside the traditional queries and mutations.
 */

import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

// Setup an HTTP link to connect to the GraphQL HTTP endpoint for standard queries and mutations.
const httpLink = new HttpLink({
  uri: 'http://localhost:4001/graphql', // Specify the URL of the GraphQL server.
});

// Setup a WebSocket link for handling GraphQL subscriptions.
const wsLink = new  GraphQLWsLink(createClient({
  url: 'ws://localhost:4001/graphql', // Specify the WebSocket endpoint for GraphQL.
}));

// Use the split function to delegate the operation to the correct link based on its type.
const splitLink = split(
  // This function determines whether to route a request to the WebSocket link or HTTP link
  // by checking if the operation is a subscription.
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Operations requiring subscriptions use the WebSocket link.
  httpLink, // Other operations (queries and mutations) use the HTTP link.
);

// Create the Apollo Client instance configured with the split link and a new in-memory cache.
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
