/**
 * Utility functions for managing JWTs (JSON Web Tokens) for the SOIL Organic application.
 * Provides functionality for generating and verifying tokens. It is crucial for securing routes
 * and ensuring that operations are performed by authenticated and authorized users.
 *
 * @module jwtUtils
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config.jwt');

/**
 * Generates a JWT for an authenticated user with a specified expiration time.
 *
 * @param {Object} user The user object containing the user's data.
 * @returns {string} A JWT string encoded with the user's details.
 */
const generateToken = (user) => {
    return jwt.sign({ id: user.user_id, name: user.name, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

/**
 * Verifies the provided JWT and decodes it to extract the user data if the token is valid.
 *
 * @param {string} token The JWT to be verified.
 * @returns {Object|null} The decoded user data if the token is valid, or null if it is invalid or expired.
 */ 
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        console.error(`JWT Verification Error: ${error.message}`);
        return null; // If token verification fails (expired or invalid), return null
    }
};

module.exports = { generateToken, verifyToken };