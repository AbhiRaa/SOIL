/**
 * Testing module for the Cart Controller functionalities in an Express application.
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

// Mock the authentication middleware to simulate a logged-in user environment.
jest.mock('../middlewares/authenticate', () => (req, res, next) => {
    req.user = { id: '1', name: 'Test User' }; // Simulating an authenticated user with ID as string
    next();
});

// Main describe block that defines the suite of cart controller tests.
// Mock DB and Routes
describe('Cart Controller Tests', () => {
    let app;
    let db;

    // Setup before each test case
    beforeEach(() => {
        // Mock database and its models' methods
        db = {
            models: {
                Cart: { findOne: jest.fn(), findOrCreate: jest.fn(), update: jest.fn(), destroy: jest.fn() },
                CartItem: { findAll: jest.fn(), findOrCreate: jest.fn(), destroy: jest.fn() },
                Product: { update: jest.fn() }
            }
        };

        // Create an Express application instance
        app = express();
        app.use(express.json());    // Middleware to parse JSON bodies
        const setupCartRoutes = require('../routes/cartRoutes');
        setupCartRoutes(app, db); // Inject mocked db into the route setup to ensure isolation
    });

     // Clean up mocks after each test case
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case for retrieving a cart successfully
    test('Get Cart - Successful', async () => {
        db.models.Cart.findOne.mockResolvedValue({
            cart_id: 1,
            user_id: '1',
            cartItems: [{
                product_id: 1,
                quantity: 2,
                product: {
                    product_name: 'Apple',
                    price_at_time: 1.5
                }
            }]
        });

        // Perform GET request to the cart endpoint
        const response = await request(app).get('/api/cart/1'); // Testing with user_id as string
        expect(response.status).toBe(200);  // Expect a 200 OK response
        expect(response.body).toHaveProperty('cart_id', 1);     // Validate the cart ID is returned correctly
        expect(db.models.Cart.findOne).toHaveBeenCalledWith({
            where: { user_id: '1' },
            include: expect.anything() // Check that the query included necessary relations
        });
    });

    // Test case for adding an item to the cart successfully
    test('Add Item - Successful', async () => {
        // Setting up database responses
        db.models.Cart.findOrCreate.mockResolvedValue([{ cart_id: 1, user_id: '1', total: 0 }, true]);
        db.models.CartItem.findOrCreate.mockResolvedValue([{ cart_item_id: 1, cart_id: 1, product_id: 1, quantity: 1, price_at_time: 10.0 }, true]);

        // Perform POST request to add an item
        const response = await request(app).post('/api/cart/add/1').send({
            productId: 1,
            quantity: 1,
            price: 10.0
        });
    
        expect(response.status).toBe(201);  // Expect a 201 Created response
        expect(response.body).toHaveProperty('message', 'Item added successfully'); // Confirm the success message
        expect(db.models.Cart.findOrCreate).toHaveBeenCalledWith({
            where: { user_id: '1' },
            defaults: { user_id: '1', total: 0 } // Default values provided during creation
        });
        expect(db.models.CartItem.findOrCreate).toHaveBeenCalledWith({
            where: { cart_id: 1, product_id: 1 },
            defaults: { quantity: 1, price_at_time: 10.0 }
        });
    });

    // Test case for successfully removing an item from the cart
    test('Remove Item - Successful', async () => {
        // Mock Cart.findOne to simulate finding a cart that exists
        db.models.Cart.findOne.mockResolvedValue({
            cart_id: 1,
            user_id: '1'
        });
        
        // Mock CartItem.destroy to simulate a successful deletion of an item
        db.models.CartItem.destroy.mockResolvedValue(1);  // Mocking successful deletion
        
        // Perform DELETE request to remove an item from the cart
        const response = await request(app).delete('/api/cart/item/1/1');
    
        expect(response.status).toBe(200);      // Expect a 200 OK response indicating successful deletion
        expect(response.body).toHaveProperty('message', 'Item removed successfully');   // Confirm the success message
        expect(db.models.Cart.findOne).toHaveBeenCalledWith({
            where: { user_id: '1' }
        });
        expect(db.models.CartItem.destroy).toHaveBeenCalledWith({
            where: {
                cart_item_id: '1',
                cart_id: 1
            }
        });
    });
    
    // Test case for attempting to remove an item that does not exist in the cart
    test('Remove Item - Item Not Found', async () => {
        // Mock Cart.findOne to simulate finding a cart
        db.models.Cart.findOne.mockResolvedValue({
            cart_id: 1,
            user_id: '1'
        });
        
        // Mock CartItem.destroy to simulate no item found for deletion
        db.models.CartItem.destroy.mockResolvedValue(0);  // Mocking no item found for deletion
        
        // Perform DELETE request to attempt removal of a non-existent item
        const response = await request(app).delete('/api/cart/item/1/1');
    
        expect(response.status).toBe(404);  // Expect a 404 Not Found response
        expect(response.body).toHaveProperty('message', 'Item not found or not in your cart');  // Confirm the error message
        expect(db.models.Cart.findOne).toHaveBeenCalledWith({
            where: { user_id: '1' }
        });
        expect(db.models.CartItem.destroy).toHaveBeenCalledWith({
            where: {
                cart_item_id: '1',  // Adjusted to string
                cart_id: 1
            }
        });
    });
    
    // Test case for attempting to remove an item from a cart that does not exist
    test('Remove Item - Cart Not Found', async () => {
        // Mock Cart.findOne to simulate not finding a cart
        db.models.Cart.findOne.mockResolvedValue(null);

        // Perform DELETE request to remove an item from a non-existent cart
        const response = await request(app).delete('/api/cart/item/1/1');
        
        expect(response.status).toBe(404); // Expect a 404 Not Found response due to no cart found
        expect(response.body).toHaveProperty('message', 'Cart not found'); // Confirm the error message
        expect(db.models.Cart.findOne).toHaveBeenCalledWith({
            where: { user_id: '1' }
        });
        // Verify that no attempt is made to remove an item if the cart does not exist
        expect(db.models.CartItem.destroy).not.toHaveBeenCalled();
    });
});
