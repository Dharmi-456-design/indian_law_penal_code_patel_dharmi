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
    const { user, accessToken, refreshToken } = await authService.registerUser(name, email, password);

    res.status(201).json(
        new ApiResponse(201, { user, accessToken, refreshToken }, 'User registered successfully')
    );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    res.status(200).json(
        new ApiResponse(200, { user, accessToken, refreshToken }, 'Login successful')
    );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken: oldRefreshToken } = req.body;
    
    if (!oldRefreshToken) {
        const ApiError = require('../utils/ApiError');
        throw new ApiError(400, 'Refresh token is required');
    }

    const tokens = await authService.refreshAccessToken(oldRefreshToken);

    res.status(200).json(
        new ApiResponse(200, tokens, 'Token refreshed successfully')
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

const updateProfile = asyncHandler(async (req, res) => {
    const userService = require('../services/user.service');
    const userId = req.user._id;
    const { name, barCouncil } = req.body;

    const updatedUser = await userService.updateProfile(userId, { name, barCouncil });

    res.status(200).json(
        new ApiResponse(200, updatedUser, 'Profile updated successfully')
    );
});

const changePassword = asyncHandler(async (req, res) => {
    const userService = require('../services/user.service');
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    await userService.updateProfile(userId, { currentPassword, newPassword });

    res.status(200).json(
        new ApiResponse(200, {}, 'Password updated successfully')
    );
});

module.exports = {
    register,
    login,
    refreshToken,
    getMe,
    logout,
    updateProfile,
    changePassword
};
