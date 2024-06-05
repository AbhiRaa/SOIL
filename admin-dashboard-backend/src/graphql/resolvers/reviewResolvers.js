const reviewResolvers = {
  Query: {
    // Fetch all reviews
    reviews: async (_, args, { models }) => {
      try {
        return await models.Review.findAll({
          where: { is_visible: true } // Optionally, only fetch visible reviews
        });
      } catch (error) {
        throw new Error('Failed to fetch reviews: ' + error.message);
      }
    },
    // Fetch a single review by ID
    review: async (_, { id }, { models }) => {
      try {
        const review = await models.Review.findByPk(id);
        if (!review) {
          throw new Error('Review not found');
        }
        return review;
      } catch (error) {
        throw new Error('Error retrieving review: ' + error.message);
      }
    },
  },

  Mutation: {
    // Update review visibility (hide/unhide)
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
        throw new Error('Error updating review visibility: ' + error.message);
      }
    },

    // Delete a review
    deleteReview: async (_, { id }, { models }) => {
      try {
        const review = await models.Review.findByPk(id);
        if (!review) {
          throw new Error('Review not found');
        }
        await review.destroy();
        return { message: "Review successfully deleted." };
      } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
      }
    }
  }
};

module.exports = reviewResolvers;