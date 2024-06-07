import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

// Create an HTTP link that connects to your GraphQL server
const httpLink = new HttpLink({
  uri: 'http://localhost:4001/graphql', // URL for the GraphQL server
});

// Create a WebSocket link for handling subscriptions
// const wsLink = createClient({
//   uri: 'ws://localhost:4001/graphql', // WebSocket is enabled at the same URI
//   options: {
//     reconnect: true // Automatically reconnect if the WebSocket connection is lost
//   }
// });
const wsLink = new  GraphQLWsLink(createClient({
  url: 'ws://localhost:4001/graphql', // Your GraphQL WebSocket endpoint
}));

// Use split to send data to each link depending on what kind of operation is being sent
const splitLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocketLink for subscriptions
  httpLink, // Use HttpLink for queries and mutations
);

// Instantiate the Apollo Client with the link and a new instance of InMemoryCache
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
