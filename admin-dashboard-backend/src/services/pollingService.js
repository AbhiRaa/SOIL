/**
 * pollingService.js
 * Handles polling of various endpoints to fetch and publish data using GraphQL subscriptions.
 * This service ensures that the front-end receives real-time updates without direct user interaction.
 */

const fetch = require('node-fetch');
const pubsub = require('../config/pubsub.js');

// Define constants for subscription topics
const LATEST_REVIEWS_FETCHED = 'LATEST_REVIEWS_FETCHED';
const PRODUCT_ENGAGEMENT_UPDATED = 'PRODUCT_ENGAGEMENT_UPDATED';
const PRODUCT_STOCK_UPDATED = 'PRODUCT_STOCK_UPDATED';

// Set intervals for polling in milliseconds
const POLL_REVIEW_INTERVAL = 1000; // Poll every second for latest reviews
const POLL_PRODUCT_INTERVAL = 2000; // Poll every two seconds for product engagement data
const POLL_STOCK_INTERVAL = 2000; // Poll every two seconds for product stock updates

/**
 * Polls the latest reviews endpoint periodically and publishes the data for subscription.
 */
async function pollReviews() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/reviews/latest');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const latestReviews = await response.json();

      if (latestReviews && latestReviews.reviews) {
        pubsub.publish(LATEST_REVIEWS_FETCHED, { latestReviewsFetched: latestReviews.reviews });
      }
    } catch (error) {
      console.error('Error polling reviews:', error);
    }
  }, POLL_REVIEW_INTERVAL);
}

/**
 * Polls the product engagement data endpoint periodically and publishes the data for subscription.
 */
async function pollProductEngagement() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/engagement');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productEngagementData = await response.json();

      if (productEngagementData && productEngagementData.products) {
        pubsub.publish(PRODUCT_ENGAGEMENT_UPDATED, { productEngagementUpdated: productEngagementData.products });
      }
    } catch (error) {
      console.error('Error polling product engagement:', error);
    }
  }, POLL_PRODUCT_INTERVAL);
}

/**
 * Polls the product stock updates endpoint periodically and publishes the data for subscription.
 */
async function pollProductStock() {
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/stockUpdates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const stockData = await response.json();

      if (stockData && stockData.products) {
        pubsub.publish(PRODUCT_STOCK_UPDATED, { productStockUpdated: stockData.products });
      }
    } catch (error) {
      console.error('Error polling product stock:', error);
    }
  }, POLL_STOCK_INTERVAL);
}


module.exports = { pollReviews, pollProductEngagement, pollProductStock };
