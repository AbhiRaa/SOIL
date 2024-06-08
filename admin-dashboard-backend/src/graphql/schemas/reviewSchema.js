/**
 * reviewSchema.js
 * 
 * Defines GraphQL schema for managing reviews, including types for authors, products, and reviews.
 * This schema enables querying, mutating, and subscribing to review data, facilitating
 * interactions with review entities in the GraphQL API.
 */

const { gql } = require('apollo-server-express');

const reviewSchema = gql`
  # Type definition for an author, a user who writes reviews
  type Author {
    user_id: ID!
    name: String!
    email: String!
  }

  # Type definition for a product associated with a review
  type Product {
    product_id: ID!
    product_name: String!
  }

  # Primary type definition for a review
  type Review {
    review_id: ID!
    product_id: ID!
    user_id: ID!
    content: String!
    rating: Int!
    is_visible: Boolean!
    created_at: String
    updated_at: String
    updated_by: String
    author: Author
    product: Product
  }

  # Queries to fetch reviews, either in bulk or a single entity
  type Query {
    reviews: [Review]
    review(id: ID!): Review
  }

  # Mutations to manage review visibility and deletion
  type Mutation {
    updateReviewVisibility(id: ID!, isVisible: Boolean!): Review
    deleteReview(id: ID!): Message
  }

  # Subscription to receive updates on newly fetched reviews
  type Subscription {
    latestReviewsFetched: [Review]
  }

  # Simple message type for feedback on operations
  type Message {
    message: String!
  }
`;

module.exports = reviewSchema;