const User = require('../models/User.models');
const Section = require('../models/Section.models');
const Bookmark = require('../models/Bookmark.models');
const Note = require('../models/Note.models');
const SearchLog = require('../models/SearchLog.models');

/**
 * Get platform overview metrics
 */
const getPlatformStats = async () => {
    const [totalUsers, totalSections, totalBookmarks, totalNotes] = await Promise.all([
        User.countDocuments(),
        Section.countDocuments({ isArchived: { $ne: true } }),
        Bookmark.countDocuments(),
        Note.countDocuments()
    ]);

    return {
        totalUsers,
        totalSections,
        totalBookmarks,
        totalNotes
    };
};

/**
 * Get sections count breakdown by act
 */
const getActDistribution = async () => {
    return await Section.aggregate([
        { $match: { isArchived: { $ne: true } } },
        {
            $group: {
                _id: "$actCode",
                actName: { $first: "$actName" },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

/**
 * Get chapter breakdown for a specific act
 */
const getChaptersBreakdown = async (actCode) => {
    const matchStage = { isArchived: { $ne: true } };
    if (actCode) {
        matchStage.actCode = actCode.toUpperCase();
    }

    return await Section.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { actCode: "$actCode", chapter: "$chapter" },
                chapterTitle: { $first: "$chapterTitle" },
                sectionsCount: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.actCode": 1,
                "_id.chapter": 1
            }
        },
        {
            $project: {
                _id: 0,
                actCode: "$_id.actCode",
                chapter: "$_id.chapter",
                chapterTitle: { $ifNull: ["$chapterTitle", "No Chapter Title"] },
                sectionsCount: 1
            }
        }
    ]);
};

/**
 * Get top viewed sections
 */
const getTopViewedLaws = async (limit = 10) => {
    return await Section.find({ isArchived: { $ne: true } })
        .sort({ viewCount: -1 })
        .limit(Number(limit))
        .select('actCode actName sectionNumber sectionTitle viewCount');
};

/**
 * Get daily search trends for the last N days
 */
const getSearchTrends = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    return await SearchLog.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1
            }
        }
    ]);
};

/**
 * Get monthly user registration growth over time
 */
const getUserGrowth = async (months = 6) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Number(months));

    return await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m", date: "$createdAt" }
                },
                registrations: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                month: "$_id",
                registrations: 1
            }
        }
    ]);
};

/**
 * Get top search queries
 */
const getTopSearchQueries = async (limit = 10) => {
    return await SearchLog.aggregate([
        {
            $group: {
                _id: { $toLower: "$query" },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: Number(limit) },
        {
            $project: {
                _id: 0,
                query: "$_id",
                count: 1
            }
        }
    ]);
};

/**
 * Get paginated and searchable search logs (admin view)
 */
const getSearchLogs = async ({ page = 1, limit = 20, search }) => {
    const filter = {};
    
    if (search) {
        // Find users matching search by name or email
        const users = await User.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');
        const userIds = users.map(u => u._id);

        filter.$or = [
            { query: { $regex: search, $options: 'i' } },
            { actCode: { $regex: search, $options: 'i' } },
            { userId: { $in: userIds } }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
        SearchLog.find(filter)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        SearchLog.countDocuments(filter)
    ]);

    const { buildPaginationMeta } = require('../utils/paginationUtil');
    const meta = buildPaginationMeta(total, Number(page), Number(limit));

    return { data, meta };
};

module.exports = {
    getPlatformStats,
    getActDistribution,
    getChaptersBreakdown,
    getTopViewedLaws,
    getSearchTrends,
    getUserGrowth,
    getTopSearchQueries,
    getSearchLogs
};
