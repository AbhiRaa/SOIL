const { gql } = require('apollo-server-express');

const reviewSchema = gql`
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
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
  }

  type Mutation {
    updateReviewVisibility(id: ID!, isVisible: Boolean!): Review
    deleteReview(id: ID!): Message
  }

  # Simple message type to confirm actions like deletions
  type Message {
    message: String!
  }
`;

module.exports = reviewSchema;