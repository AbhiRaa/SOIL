const authenticate = require('../middlewares/authenticate');

module.exports = (app, db) => {
    const reviewController = require('../controllers/reviewController')(db);  // Passing models to the controller


    //add a review
    app.post('/api/review', authenticate, reviewController.addReview);

    //fetch reviews for a product
    app.get('/api/review/:productId', authenticate, reviewController.fetchReviews);

    //update a review
    app.put('/api/review/update/:reviewId', authenticate, reviewController.updateReview);

    //delete a review
    app.delete('/api/review/:reviewId',authenticate,reviewController.deleteReview)

    //add a reply
    app.post('/api/reply/:reviewId',authenticate,reviewController.addReply)

    //fetch replies
    app.get('/api/replies/:reviewId',authenticate,reviewController.fetchReplies)

    app.get('/api/reviews/latest', reviewController.fetchLatestReviews)

    app.get('/api/products/engagement', reviewController.fetchProductEngagement);
}