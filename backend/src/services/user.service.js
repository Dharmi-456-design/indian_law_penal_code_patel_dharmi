const User = require('../models/User.models');
const ApiError = require('../utils/ApiError');
const { buildPaginationMeta } = require('../utils/paginationUtil');
const bcrypt = require('bcryptjs');

const getAllUsers = async ({ page = 1, limit = 20, role, isActive, search }) => {
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
        User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-password -__v -refreshToken'),
        User.countDocuments(filter)
    ]);

    const meta = buildPaginationMeta(total, Number(page), Number(limit));
    return { data, meta };
};

const getUserById = async (id) => {
    const user = await User.findById(id).select('-password -__v -refreshToken');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

const updateUserRole = async (id, role) => {
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role');
    }
    
    const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
    ).select('-password -__v -refreshToken');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

const toggleUserStatus = async (id, isActive) => {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive },
        { new: true, runValidators: true }
    ).select('-password -__v -refreshToken');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    ).select('-password -__v -refreshToken');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

const getUserStats = async () => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
                admins: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
                regularUsers: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);

    return stats[0] || { totalUsers: 0, activeUsers: 0, admins: 0, regularUsers: 0 };
};

const updateProfile = async (userId, updateData) => {
    const { name, email, currentPassword, newPassword } = updateData;
    
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (newPassword) {
        if (!currentPassword) {
            throw new ApiError(400, 'Current password is required to change password');
        }
        
        const isMatch = await user.isPasswordCorrect(currentPassword);
        if (!isMatch) {
            throw new ApiError(400, 'Incorrect current password');
        }
        
        user.password = newPassword;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    
    const result = user.toObject();
    delete result.password;
    
    return result;
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getUserStats,
    updateProfile
};
