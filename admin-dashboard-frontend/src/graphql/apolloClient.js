import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create a HTTP link that connects to your GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql', // URL for the GraphQL server
});

// Instantiate the Apollo Client with the link and a new instance of InMemoryCache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;