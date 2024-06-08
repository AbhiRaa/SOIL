/**
 * Testing module for the Review Controller functionalities in an Express application.
 * Utilizes jest for mocking functions and supertest for handling HTTP assertions.
 * This module simulates user authentication and tests CRUD operations on the shopping cart.
 * 
 * This approach involves simulating the authentication process by mocking the authentication middleware
 * to always pass during tests. This method tests the routes under the assumption that the user is authenticated.
 * 
 * Detail explanation in Readme file.
 */
const request = require('supertest');
const express = require('express');

// Mocking authentication middleware to simulate an authenticated user
jest.mock('../middlewares/authenticate', () => (req, res, next) => {
    req.user = { id: '1', name: 'Test User' }; // Simulating an authenticated user with ID as string
    next();
});

// Group tests for Review Controller functionalities
describe('Review Controller Tests', () => {
    let app; // Variable to hold our app
    let db;  // Mock database

    // Setup before each test
    beforeEach(() => {
        // Mock database and its methods
        db = {
            models: {
                Review: { create: jest.fn(), findByPk: jest.fn(), findAll: jest.fn(), update: jest.fn(), destroy: jest.fn() },
                User: { findAll: jest.fn() },
                Product: {},
                ReviewReply: { create: jest.fn(), findAll: jest.fn() },
            }
        };

        // Initialize the app
        app = express();
        app.use(express.json());
        // Import and setup routes for testing
        const setupReviewRoutes = require('../routes/reviewRoutes');
        setupReviewRoutes(app, db); // Inject the mocked db and routes into the app
    });

    // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for adding a new review successfully
    test('Add Review - Successful', async () => {
        // Mock creating a review
        db.models.Review.create.mockResolvedValue({ review_id: 1 });
        // Mock retrieving the newly created review with user info
        db.models.Review.findByPk.mockResolvedValue({
            review_id: 1,
            content: "Great product!",
            author: { user_id: 1, name: "Test User" }
        });

        // Perform the request to the add review endpoint
        const response = await request(app).post('/api/review').send({
            product_id: 1,
            user_id: '1',
            rating: 5,
            content: "Great product!"
        });

        // Expect a 201 status for successful creation
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Review added successfully');
        // Ensure the response includes the review details
        expect(response.body.review).toEqual(expect.objectContaining({
            review_id: 1,
            content: "Great product!"
        }));
        expect(db.models.Review.create).toHaveBeenCalledWith(expect.anything());
    });

    // Test for fetching reviews of a specific product
    test('Fetch Reviews - Successful', async () => {
        // Mock finding reviews for a specific product
        db.models.Review.findAll.mockResolvedValue([
            { review_id: 1, content: "Good!", product_id: 1, user_id: 1, author: { name: "Test User" } }
        ]);

        // Perform the request to fetch reviews
        const response = await request(app).get('/api/review/1');

        // Expect a 200 status for successful fetch
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Reviews fetched successfully');
        // Verify that the reviews are returned in the response
        expect(response.body.reviews).toEqual(expect.arrayContaining([
            expect.objectContaining({ content: "Good!" })
        ]));
        expect(db.models.Review.findAll).toHaveBeenCalledWith(expect.anything());
    });
});
