/**
 * productResolvers.js
 * 
 * Resolvers for product-related GraphQL operations. This file defines resolver functions for queries,
 * mutations, and subscriptions related to products. Each resolver function includes error handling
 * to manage common issues like database connectivity errors and ensures that operations such as 
 * adding, updating, or deleting a product are handled properly.
 */

const pubsub = require('../../config/pubsub.js');

const PRODUCT_ENGAGEMENT_UPDATED = 'PRODUCT_ENGAGEMENT_UPDATED';
const PRODUCT_STOCK_UPDATED = 'PRODUCT_STOCK_UPDATED';

const productResolvers = {
  Query: {
    // Fetch all products
    products: async (_, args, { models }) => {
      try {
        return await models.Product.findAll();
      } catch (error) {
        console.error('Error fetching all products:', error);
        throw new Error('Failed to fetch products: ' + error.message);
      }
    },
    // Fetch a single product by ID
    product: async (_, { id }, { models }) => {
      try {
        const product = await models.Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        console.error(`Error retrieving product with ID ${id}:`, error);
        throw new Error('Error retrieving product: ' + error.message);
      }
    },
  },

  Mutation: {
    // Add a new product
    addProduct: async (_, { productInput }, { models }) => {
      try {
        console.log('Adding product with:', productInput); 
        return await models.Product.create({
          product_name: productInput.product_name,
          product_description: productInput.product_description,
          product_price: productInput.product_price,
          product_image: productInput.product_image || "images/product-default.jpeg",
          minimum_purchase_unit: productInput.minimum_purchase_unit,
          product_stock: productInput.product_stock,
          is_special: productInput.is_special,
          created_at: new Date(),
          updated_at: new Date(),
          updated_by: 'admin_email@soil.com'
        });
      } catch (error) {
        console.error('Failed to add product:', error); 
        throw new Error('Error adding product: ' + error.message);
      }
    },

    // Edit an existing product
    editProduct: async (_, { id, productInput }, { models }) => {
      try {
        const product = await models.Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        product.product_name = productInput.product_name;
        product.product_description = productInput.product_description;
        product.product_price = productInput.product_price;
        product.product_image = productInput.product_image;
        product.minimum_purchase_unit = productInput.minimum_purchase_unit;
        product.product_stock = productInput.product_stock;
        product.is_special = productInput.is_special;
        product.updated_at = new Date();
        product.updated_by = 'admin_email@soil.com';
        await product.save();
        return product;
      } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw new Error('Error updating product: ' + error.message);
      }
    },

    // Delete a product
    deleteProduct: async (_, { id }, { models }) => {
      try {
        const product = await models.Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        await product.destroy();
        return { message: "Product successfully deleted." };
      } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw new Error('Error deleting product: ' + error.message);
      }
    }
  }, 
  
  Subscription: {
    productEngagementUpdated: {
      subscribe: () => pubsub.asyncIterator(PRODUCT_ENGAGEMENT_UPDATED)
    },
    productStockUpdated: {
      subscribe: () => pubsub.asyncIterator(PRODUCT_STOCK_UPDATED)
    }
  }
};

module.exports = productResolvers;