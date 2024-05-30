const { verifyToken } = require('../utils/jwtUtils');

const authenticate = (req, res, next) => {
    // const token = req.headers['authorization'];
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).send({ message: "Unauthorized!" });
    }

    req.userId = decoded.id; // Add user id to request object
    next();
};

module.exports = authenticate;