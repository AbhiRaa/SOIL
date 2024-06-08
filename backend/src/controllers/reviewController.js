/**
 * Review Controller: Manages all operations related to reviews on products, including creating reviews,
 * updating, deleting, fetching reviews, and managing replies to reviews.
 */

module.exports = (db) => {
  const { Review, User, Product, ReviewReply } = db.models;
  const { Sequelize } = db;

  return {
    /**
     * Adds a new review to a product by a user.
     * @param {Object} req - The HTTP request object.
     * @listens {ProductID} - Expects product ID in the request body.
     * @param {Object} res - The HTTP response object.
     */
    addReview: async (req, res) => {
      try {
        // Add a new review
        const review = await Review.create(req.body);

        // Retrieve the newly created review with the associated user information
        const completeReview = await Review.findByPk(review.review_id, {
          include: [
            {
              model: User,
              as: "author",
            },
          ],
        });

        res
          .status(201)
          .json({
            message: "Review added successfully",
            review: completeReview,
          });
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    /**
     * Fetches all reviews for a specific product.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    fetchReviews: async (req, res) => {
      const { productId } = req.params;

      try {
        const reviews = await Review.findAll({
          where: { product_id: productId },
          include: [
            {
              model: User,
              as: "author",
              attributes: ["user_id", "name"], // Select only necessary fields
            },
          ],
        });

        if (reviews.length === 0) {
          return res
            .status(404)
            .json({ message: "No reviews found for this product" });
        }

        res.json({
          message: "Reviews fetched successfully",
          reviews,
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error while fetching reviews" });
      }
    },
    
    /**
     * Updates a review made by a user.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * Checks if the user updating the review is authorized to do so.
     */
    updateReview: async (req, res) => {
        const { reviewId } = req.params;
        const { rating, content, user_id, product_id } = req.body;

        try {
            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).send({ message: "Review not found." });
            }

            // Check if the user updating the review is the one who wrote it or if they're authorized
            if (review.user_id !== user_id) {
                return res.status(403).send({ message: "Unauthorized to update this review." });
            }

            // Update the review
            review.rating = rating;
            review.content = content;
            await review.save();
            
            res.send({ message: "Review updated successfully", review });
        }catch (error) {
          console.error("Error updating review:", error);
          res.status(500).send({ message: "Error updating review", error: error.message });
        }
    },

    /**
     * Deletes a review.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    deleteReview: async(req,res)=>{
      const { reviewId } = req.params;
      try {
        const result = await Review.destroy({
            where: { review_id: reviewId }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Review not found or already deleted.' });
        }

        res.status(201).json({ message: 'Review deleted successfully.' });
        } catch (error) {
          console.error('Error deleting review:', error);
          res.status(500).json({ message: 'Internal server error while deleting review' });
        }
    },

    /**
     * Adds a reply to a review.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * Validates that necessary information is provided before proceeding.
     */
    addReply : async (req, res) => {
        const { reviewId } = req.params;
        const { user_id, content } = req.body;
        console.log(req.body)
    
        if (!user_id || !content) {
            return res.status(400).send({ message: 'Missing user ID or content for the reply.' });
        }
    
        try {
            // Create a reply
            const newReply = await ReviewReply.create({
            review_id:reviewId,
            user_id,
            content
            });

            res.json({
              message: 'Reply added successfully',
              reply: {
                reply_id: newReply.reply_id,
                content: newReply.content,
              }
          });
        } catch (error) {
            console.error('Error adding reply:', error);
            return res.status(500).send({ message: 'Internal server error' });
        }
    },

    /**
     * Fetches replies for a specific review.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    fetchReplies: async (req, res) => {
        try {
          const { reviewId } = req.params;
          const replies = await ReviewReply.findAll({
              where: { review_id: reviewId },
              
          });
          
          if (!replies) {
              return res.json({ message: 'No replies found', replies });
          }
          

          // Collect user IDs from replies
          const userIds = replies.map(reply => reply.user_id);
          // Fetch users using collected user IDs
          const users = await User.findAll({
              where: { user_id: userIds },
              attributes: ['user_id', 'name'] // assuming 'name' is the field for the username
          });

          // Map user data to an object for quick lookup
          const userMap = users.reduce((map, user) => {
              map[user.user_id] = user.name;
              return map;
          }, {});

          // Add username to each reply based on user ID
          const repliesWithUsernames = replies.map(reply => ({
              ...reply.dataValues, // spread existing reply properties
              userName: userMap[reply.user_id] || 'Unknown' // add username or 'Unknown' if not found
          }));
          return res.json({ message: 'Replies found', replies: repliesWithUsernames });
        } catch (error) {
          console.error('Error fetching replies:', error);
          res.status(500).json({ message: 'Error retrieving replies', error });
        }
    },

    /**
     * Fetches the latest reviews, limited to the most recent three. - ADMIN
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response future object.
     * Includes associated user and product information.
     */
    fetchLatestReviews: async (req, res) => {
      try {
        const latestReviews = await Review.findAll({
          limit: 3,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: "author",
              attributes: ["user_id", "name", "email"], // Only fetch necessary fields
            },
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "product_name"] // Assuming you want to show product info
            }
          ]
        });
    
        res.json({
          message: "Latest reviews fetched successfully",
          reviews: latestReviews
        });
      } catch (error) {
        console.error("Error fetching latest reviews:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
    
    /**
     * Fetches engagement data for all products based on reviews. - ADMIN
     * Calculates the count of reviews and average rating for each product.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    fetchProductEngagement: async (req, res) => {
      try {
        const products = await Product.findAll({
          include: [{
            model: Review,
            as: 'reviews',
            attributes: [],
            where: {
              is_visible: true
            },
            required: false
          }],
          attributes: [
            'product_id',
            'product_name',
            'is_special',
            [Sequelize.fn('COUNT', Sequelize.col('reviews.review_id')), 'count'], // Correct usage of Sequelize.col
            [Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'averageRating']
          ],
          group: ['Product.product_id', 'Product.product_name', 'Product.is_special'],
          order: [[Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'DESC']] // Optionally order by average rating
        });

        const formattedProducts = products.map(product => ({
          product_id: product.product_id,
          product_name: product.product_name,
          is_special: product.is_special,
          reviewsAggregate: {
            count: product.dataValues.count,
            averageRating: parseFloat(product.dataValues.averageRating).toFixed(1)
          }
        }));

        res.json({
          message: "Product engagement data fetched successfully",
          products: formattedProducts
        });
      } catch (error) {
        console.error("Error fetching product engagement:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
};
