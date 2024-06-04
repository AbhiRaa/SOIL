module.exports = (db) => {
  const { Review, User, Product } = db.models;
  // const { sequelize } = db;

  return {
    addReview: async (req, res) => {
      try {
        // Add a new review
        const review = await Review.create(req.body);

        // Retrieve the newly created review with the associated user information
        const completeReview = await Review.findByPk(review.review_id, {
          include: [
            {
              model: User,
              as: "author", // Ensure this alias matches the one used in the association
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

    fetchReviews: async (req, res) => {
      const { productId } = req.params; // Assuming the product ID is passed as a URL parameter

      try {
        const reviews = await Review.findAll({
          where: { product_id: productId },
          include: [
            {
              model: User,
              as: "author", // Make sure 'as' matches the alias used in your association
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
        res.status(500).json({ message: "Internal server error" });
      }
    },
    
    updateReview: async (req, res) => {
        const { reviewId } = req.params;
        const { rating, content, user_id, product_id } = req.body; // Ensure these are the fields you allow to update

        try {
            const review = await Review.findByPk(reviewId); // Assuming you have a Review model

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
            res.status(500).send({ message: "Error updating review", error: error.message });
        }
    }
  }
};
