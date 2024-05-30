const jwt = require('jsonwebtoken');
const config = require('../config/config.jwt');

// Generates a token with an expiration time
const generateToken = (user) => {
    return jwt.sign({ id: user.user_id, name: user.name, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

// Verifies the token and checks expiration
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null; // If token verification fails (expired or invalid), return null
    }
};

module.exports = { generateToken, verifyToken };