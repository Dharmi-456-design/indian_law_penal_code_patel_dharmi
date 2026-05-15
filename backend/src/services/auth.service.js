const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.models');
const ApiError = require('../utils/ApiError');

/**
 * Generate a JWT for a user.
 * Payload: { id, email, role }
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

/**
 * Register a new user.
 */
const registerUser = async (name, email, password) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user);
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};

/**
 * Login user and return token.
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};

module.exports = {
    registerUser,
    loginUser,
    generateToken
};
