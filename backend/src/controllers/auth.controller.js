const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, token } = await authService.registerUser(name, email, password);

    res.status(201).json(
        new ApiResponse(201, { user, token }, 'User registered successfully')
    );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json(
        new ApiResponse(200, { user, token }, 'Login successful')
    );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.user, 'User profile fetched successfully')
    );
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, 'Logged out successfully')
    );
});

module.exports = {
    register,
    login,
    getMe,
    logout
};
