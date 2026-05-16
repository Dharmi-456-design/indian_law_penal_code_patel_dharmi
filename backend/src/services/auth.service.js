const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.models');
const ApiError = require('../utils/ApiError');

/**
 * Generate Access and Refresh tokens for a user.
 */
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || 'refresh-secret-123',
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
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

    const { accessToken, refreshToken } = generateTokens(user);
    
    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { user: userResponse, accessToken, refreshToken };
};

/**
 * Login user and return token.
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { user: userResponse, accessToken, refreshToken };
};

/**
 * Refresh access token using refresh token.
 */
const refreshAccessToken = async (oldRefreshToken) => {
    try {
        const decoded = jwt.verify(
            oldRefreshToken,
            process.env.JWT_REFRESH_SECRET || 'refresh-secret-123'
        );

        const user = await User.findById(decoded.id).select('+refreshToken');
        
        if (!user || user.refreshToken !== oldRefreshToken) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const tokens = generateTokens(user);
        
        // Update refresh token in DB
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;
    } catch (err) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    generateTokens
};
