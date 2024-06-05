module.exports = (db) => {
  const { Review, User, Product, ReviewReply } = db.models;
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
    },

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

                
                // Since you only need the reply ID and content, there's no need to fetch it again
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

    fetchReplies:async (req, res) => {
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
            res.status(500).json({ message: 'Error retrieving cart', error });
        }
    },

  }
};
