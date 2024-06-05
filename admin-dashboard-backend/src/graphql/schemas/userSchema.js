const { gql } = require('apollo-server-express');

const userSchema = gql`
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

  # Input types allow you to pass structured data into mutations
  input CreateUserInput {
    email: String!
    name: String!
    password: String!
    is_admin: Boolean
  }

  input UpdateUserInput {
    email: String
    name: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    blockUser(id: ID!): User
    unblockUser(id: ID!): User
    createUser(userInput: CreateUserInput!): User
    updateUser(id: ID!, userInput: UpdateUserInput!): User
  }
`;

module.exports = userSchema;