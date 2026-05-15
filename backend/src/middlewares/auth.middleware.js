const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.models');

/**
 * Middleware to protect routes with JWT.
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            throw new ApiError(401, 'User not found');
        }

        next();
    } catch (err) {
        throw new ApiError(401, 'Not authorized to access this route');
    }
});

/**
 * Middleware to restrict access based on roles.
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `User role ${req.user.role} is not authorized to access this route`
            );
        }
        next();
    };
};

module.exports = { protect, restrictTo };
