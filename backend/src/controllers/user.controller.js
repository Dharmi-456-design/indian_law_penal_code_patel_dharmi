const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');

const getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit, role, isActive, search } = req.query;
    
    let isActiveBool;
    if (isActive !== undefined) {
        isActiveBool = isActive === 'true';
    }

    const { data, meta } = await userService.getAllUsers({
        page,
        limit,
        role,
        isActive: isActiveBool,
        search
    });

    return res.status(200).json(
        new ApiResponse(200, data, 'Users retrieved successfully', meta)
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    return res.status(200).json(
        new ApiResponse(200, user, 'User retrieved successfully')
    );
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await userService.updateUserRole(id, role);
    
    return res.status(200).json(
        new ApiResponse(200, user, 'User role updated successfully')
    );
});

const toggleUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await userService.toggleUserStatus(id, isActive);
    
    return res.status(200).json(
        new ApiResponse(200, user, 'User status updated successfully')
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    
    return res.status(200).json(
        new ApiResponse(200, user, 'User soft-deleted successfully')
    );
});

const getUserStats = asyncHandler(async (req, res) => {
    const stats = await userService.getUserStats();
    
    return res.status(200).json(
        new ApiResponse(200, stats, 'User stats retrieved successfully')
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, email, barCouncil, currentPassword, newPassword } = req.body;
    
    const updatedUser = await userService.updateProfile(userId, {
        name,
        email,
        barCouncil,
        currentPassword,
        newPassword
    });
    
    return res.status(200).json(
        new ApiResponse(200, updatedUser, 'Profile updated successfully')
    );
});

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getUserStats,
    updateProfile
};
