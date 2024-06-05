const { gql } = require('apollo-server-express');

const productSchema = gql`
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

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(productInput: ProductInput!): Product
    editProduct(id: ID!, productInput: ProductInput!): Product
    deleteProduct(id: ID!): Message
  }

  # Simple message type to confirm actions like deletions
  type Message {
    message: String!
  }
`;

module.exports = productSchema;