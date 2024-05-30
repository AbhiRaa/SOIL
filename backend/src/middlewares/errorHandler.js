const errorHandler = (err, req, res, next) => {
    console.error(err); // Log every error but could be improved to be conditional based on environment

    if (typeof(err) === 'string') {
        // Custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // JWT authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (err.name === 'ValidationError') {
        // Validation error from celebrate or another validation library
        return res.status(400).json({ message: err.message, details: err.details || {} });
    }

    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
        // Handle Sequelize database errors
        return res.status(503).json({ message: 'Database error', details: err.message });
    }

    // Default to 500 server error
    return res.status(500).json({ message: 'Something went wrong', details: process.env.NODE_ENV === 'development' ? err.stack : {} });
};

module.exports = {
    errorHandler
};