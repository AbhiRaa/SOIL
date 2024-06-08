/**
 * Authentication middleware for the SOIL Organic backend application.
 * This middleware ensures that the API requests are authenticated using JSON Web Tokens (JWT).
 * It checks for the presence of a JWT in the Authorization header of the incoming requests
 * and validates it. If the token is valid, the request is allowed to proceed; otherwise,
 * an appropriate error response is sent back.
 *
 * @module authenticate
 */

const { verifyToken } = require('../utils/jwtUtils');

/**
 * Middleware to authenticate API requests using JWT.
 * Extracts the token from the Authorization header and verifies it.
 * If verified, the user's ID from the decoded token is attached to the request object.
 * If verification fails due to missing or invalid token, an error response is sent.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function in the stack.
 */
const authenticate = (req, res, next) => {
    // Extract token from the Authorization header ('Bearer [token]')
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
        // Send an error if the token is missing from the request
        return res.status(403).send({ message: "No token provided!" });
    }
    // Verify the extracted token
    const decoded = verifyToken(token);
    if (!decoded) {
        // Send an error if the token is invalid or expired
        return res.status(401).send({ message: "Unauthorized!" });
    }

    // If token is verified, add the decoded user ID to the request object for use in subsequent middleware or controllers
    req.userId = decoded.id;
    next();
};

module.exports = authenticate;