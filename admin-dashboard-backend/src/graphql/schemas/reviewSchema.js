const { gql } = require('apollo-server-express');

const reviewSchema = gql`
  type Author {
    user_id: ID!
    name: String!
    email: String!
  }

  type Product {
    product_id: ID!
    product_name: String!
  }

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

  type Query {
    reviews: [Review]
    review(id: ID!): Review
  }

  type Mutation {
    updateReviewVisibility(id: ID!, isVisible: Boolean!): Review
    deleteReview(id: ID!): Message
  }

  type Subscription {
    latestReviewsFetched: [Review]
  }

  # Simple message type to confirm actions like deletions
  type Message {
    message: String!
  }
`;

module.exports = reviewSchema;