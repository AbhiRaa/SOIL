const fetch = require('node-fetch');
const pubsub = require('../config/pubsub.js');

const LATEST_REVIEWS_FETCHED = 'LATEST_REVIEWS_FETCHED';
const PRODUCT_ENGAGEMENT_UPDATED = 'PRODUCT_ENGAGEMENT_UPDATED';
const PRODUCT_STOCK_UPDATED = 'PRODUCT_STOCK_UPDATED';

const POLL_REVIEW_INTERVAL = 10000; // Poll every 10 seconds for home page widget
const POLL_PRODUCT_INTERVAL = 10000; // Poll every 10 seconds for product's reviews updates
const POLL_STOCK_INTERVAL = 10000; // Poll every 10 seconds for stock updates

async function pollReviews() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/reviews/latest');
      const latestReviews = await response.json();

      if (latestReviews && latestReviews.reviews) {
        console.log("Publishing latest reviews:", latestReviews.reviews);
        pubsub.publish(LATEST_REVIEWS_FETCHED, { latestReviewsFetched: latestReviews.reviews });
      }
    } catch (error) {
      console.error('Error polling reviews:', error);
    }
  }, POLL_REVIEW_INTERVAL);
}

async function pollProductEngagement() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/engagement');
      const productEngagementData = await response.json();

      if (productEngagementData && productEngagementData.products) {
        console.log("Publishing product engagement data:", productEngagementData.products);
        pubsub.publish(PRODUCT_ENGAGEMENT_UPDATED, { productEngagementUpdated: productEngagementData.products });
      }
    } catch (error) {
      console.error('Error polling product engagement:', error);
    }
  }, POLL_PRODUCT_INTERVAL);
}

async function pollProductStock() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/stockUpdates');
      const stockData = await response.json();

      if (stockData && stockData.products) {
        console.log("Publishing product stock updates:", stockData.products);
        pubsub.publish(PRODUCT_STOCK_UPDATED, { productStockUpdated: stockData.products });
      }
    } catch (error) {
      console.error('Error polling product stock:', error);
    }
  }, POLL_STOCK_INTERVAL);
}


module.exports = { pollReviews, pollProductEngagement, pollProductStock };
