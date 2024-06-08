/**
 * productSchema.js
 * 
 * Defines GraphQL schema for products including types for products, product engagements,
 * stock updates, and the associated mutations and queries. This schema is part of the
 * GraphQL API which allows clients to interact with product data.
 */

const { gql } = require('apollo-server-express');

const productSchema = gql`
  # Type definitions for aggregating reviews data
  type ReviewsAggregate {
    count: Int!
    averageRating: String!
  }

  # Type definitions for product engagement data
  type ProductEngagement {
    product_id: ID!
    product_name: String!
    is_special: Boolean!
    reviewsAggregate: ReviewsAggregate
  }
  
  # Type definitions for product stock updates
  type ProductStockUpdate {
    product_id: ID!
    product_name: String!
    product_price: String!
    minimum_purchase_unit: String!
    is_special: Boolean!
    product_stock: Int!
  }

  # Subscriptions to track product stock updates
  extend type Subscription {
    productStockUpdated: [ProductStockUpdate]
  }

  # Subscriptions to track product engagement updates
  extend type Subscription {
    productEngagementUpdated: [ProductEngagement]
  }

  # Primary product type definition
  type Product {
    product_id: ID!
    product_name: String!
    product_description: String!
    product_price: Float!
    product_image: String
    minimum_purchase_unit: String!
    product_stock: Int!
    is_special: Boolean!
    created_at: String
    updated_at: String
    updated_by: String
  }

  # Input types for creating and updating products
  input ProductInput {
    product_name: String!
    product_description: String!
    product_price: Float!
    product_image: String
    minimum_purchase_unit: String!
    product_stock: Int!
    is_special: Boolean
  }

  # Queries to fetch products
  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  # Mutations to manage products
  type Mutation {
    addProduct(productInput: ProductInput!): Product
    editProduct(id: ID!, productInput: ProductInput!): Product
    deleteProduct(id: ID!): Message
  }

  # Simple message type for feedback on mutations
  type Message {
    message: String!
  }
`;

module.exports = productSchema;