/**
 * reviewResolvers.js
 *
 * This module defines GraphQL resolvers for operations related to reviews. These include queries to
 * fetch reviews, mutations to manage review visibility and deletion, and a subscription for real-time
 * updates when new reviews are fetched. Robust error handling and meaningful logging are integrated
 * for better maintenance and troubleshooting.
 */

const pubsub = require('../../config/pubsub.js');

const LATEST_REVIEWS_FETCHED = 'LATEST_REVIEWS_FETCHED';

const reviewResolvers = {
  Query: {
    /**
     * Fetch all reviews, including associated author and product information.
     */
    reviews: async (_, args, { models }) => {
      try {
        return await models.Review.findAll({
          // where: { is_visible: true }, // Only fetch visible reviews
          include: [
            { model: models.User, as: 'author', attributes: ["user_id", "name", "email"] },
            { model: models.Product, as: 'product', attributes: ["product_id", "product_name"] }
          ] // Eager loading of author and product
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Failed to fetch reviews: ' + error.message);
      }
    },

    /**
     * Fetch a specific review by its ID.
     */
    review: async (_, { id }, { models }) => {
      try {
        const review = await models.Review.findByPk(id);
        if (!review) {
          throw new Error('Review not found');
        }
        return review;
      } catch (error) {
        console.error(`Error retrieving review with ID ${id}:`, error);
        throw new Error('Error retrieving review: ' + error.message);
      }
    },
  },

  Mutation: {
    /**
     * Update the visibility of a review.
     */
    updateReviewVisibility: async (_, { id, isVisible }, { models }) => {
      try {
        const review = await models.Review.findByPk(id);
        if (!review) {
          throw new Error('Review not found');
        }
        review.is_visible = isVisible;
        review.updated_at = new Date();
        review.updated_by = 'admin_email@soil.com';
        await review.save();
        return review;
      } catch (error) {
        console.error(`Error updating visibility for review ID ${id}:`, error);
        throw new Error('Error updating review visibility: ' + error.message);
      }
    },

    /**
     * Delete a review by its ID.
     */
    deleteReview: async (_, { id }, { models }) => {
      try {
        const review = await models.Review.findByPk(id);
        if (!review) {
          throw new Error('Review not found');
        }
        await review.destroy();
        return { message: "Review successfully deleted." };
      } catch (error) {
        console.error(`Error deleting review ID ${id}:`, error);
        throw new Error('Error deleting review: ' + error.message);
      }
    }
  },

  Subscription: {
    latestReviewsFetched: {
        subscribe: () => {
            try {
                return pubsub.asyncIterator(LATEST_REVIEWS_FETCHED);
            } catch (error) {
                console.error("Subscription error:", error);
                throw error;
            }
        }
    }
  }
};

module.exports = reviewResolvers; 

