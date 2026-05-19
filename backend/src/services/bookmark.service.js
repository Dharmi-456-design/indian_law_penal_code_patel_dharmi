const Bookmark = require('../models/Bookmark.models');
const Section = require('../models/Section.models');
const ApiError = require('../utils/ApiError');
const { buildPaginationMeta } = require('../utils/paginationUtil');

const addBookmark = async (userId, sectionId) => {
    // Check if section exists
    const sectionExists = await Section.findById(sectionId);
    if (!sectionExists) {
        throw new ApiError(404, 'Section not found');
    }

    // Upsert logic to prevent duplicates
    const bookmark = await Bookmark.findOneAndUpdate(
        { userId, lawId: sectionId },
        { userId, lawId: sectionId },
        { new: true, upsert: true } // Creates it if it doesn't exist
    ).populate('lawId', 'actCode sectionNumber sectionTitle');

    return bookmark;
};

const removeBookmark = async (userId, sectionId) => {
    const bookmark = await Bookmark.findOneAndDelete({ userId, lawId: sectionId });
    
    if (!bookmark) {
        throw new ApiError(404, 'Bookmark not found');
    }
    
    return bookmark;
};

const getUserBookmarks = async ({ userId, page = 1, limit = 20, actCode }) => {
    const skip = (Number(page) - 1) * Number(limit);
    
    const pipeline = [
        { $match: { userId } },
        {
            $lookup: {
                from: 'sections',
                localField: 'lawId',
                foreignField: '_id',
                as: 'lawDetails'
            }
        },
        { $unwind: '$lawDetails' }
    ];

    if (actCode) {
        pipeline.push({ $match: { 'lawDetails.actCode': actCode } });
    }

    const [data, totalResult] = await Promise.all([
        Bookmark.aggregate([
            ...pipeline,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: Number(limit) },
            {
                $project: {
                    _id: 1,
                    note: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lawId: {
                        _id: '$lawDetails._id',
                        actCode: '$lawDetails.actCode',
                        sectionNumber: '$lawDetails.sectionNumber',
                        sectionTitle: '$lawDetails.sectionTitle'
                    }
                }
            }
        ]),
        Bookmark.aggregate([...pipeline, { $count: 'total' }])
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;
    const meta = buildPaginationMeta(total, Number(page), Number(limit));

    return { data, meta };
};

const isBookmarked = async (userId, sectionId) => {
    const bookmark = await Bookmark.findOne({ userId, lawId: sectionId });
    return { isBookmarked: !!bookmark };
};

const updateBookmarkNote = async (userId, sectionId, note) => {
    const bookmark = await Bookmark.findOneAndUpdate(
        { userId, lawId: sectionId },
        { note },
        { new: true }
    ).populate('lawId', 'actCode sectionNumber sectionTitle');

    if (!bookmark) {
        throw new ApiError(404, 'Bookmark not found');
    }

    return bookmark;
};

module.exports = {
    addBookmark,
    removeBookmark,
    getUserBookmarks,
    isBookmarked,
    updateBookmarkNote
};
