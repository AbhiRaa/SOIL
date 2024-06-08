/**
 * userSchema.js
 * 
 * Defines the GraphQL schema for user entities. This schema includes types for User objects,
 * as well as input types for creating and updating users. It provides a comprehensive set of
 * GraphQL operations such as querying for users, creating new users, updating existing users,
 * and managing user status (blocking/unblocking).
 */

const { gql } = require('apollo-server-express');

const userSchema = gql`
  # Represents a user in the system with comprehensive fields
  type User {
    user_id: ID!
    email: String!
    name: String!
    password_hash: String!
    join_date: String
    is_admin: Boolean!
    is_blocked: Boolean!
    created_at: String
    updated_at: String
    updated_by: String
  }

  # Input type for creating a new user
  input CreateUserInput {
    email: String!
    name: String!
    password: String!
    is_admin: Boolean
  }

  # Input type for updating existing user details
  input UpdateUserInput {
    email: String
    name: String
  }

  # Queries for fetching user data
  type Query {
    users: [User]
    user(id: ID!): User
  }

  # Mutations for managing users
  type Mutation {
    blockUser(id: ID!): User
    unblockUser(id: ID!): User
    createUser(userInput: CreateUserInput!): User
    updateUser(id: ID!, userInput: UpdateUserInput!): User
  }
`;

module.exports = userSchema;