const Act = require('../models/Act.models');
const Section = require('../models/Section.models');
const ApiError = require('../utils/ApiError');
const { buildPaginationMeta } = require('../utils/paginationUtil');

const getAllActs = async () => {
    return await Act.find().sort({ actYear: 1 });
};

const getActByCode = async (actCode) => {
    const act = await Act.findOne({ actCode });
    if (!act) {
        throw new ApiError(404, 'Act not found');
    }
    return act;
};

const getActSections = async (actCode, page = 1, limit = 20) => {
    const filter = { actCode, isArchived: false };
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
        Section.find(filter)
            .sort({ sectionNumber: 1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-__v'),
        Section.countDocuments(filter)
    ]);

    const meta = buildPaginationMeta(total, Number(page), Number(limit));
    return { data, meta };
};

const getActChapters = async (actCode) => {
    // Group sections by chapter for a specific act
    const chapters = await Section.aggregate([
        { $match: { actCode, isArchived: false, chapter: { $ne: null } } },
        { 
            $group: { 
                _id: "$chapter", 
                chapterTitle: { $first: "$chapterTitle" }, 
                sectionCount: { $sum: 1 } 
            } 
        },
        { $sort: { _id: 1 } }
    ]);
    return chapters;
};

const getActStats = async (actCode) => {
    const act = await getActByCode(actCode);

    const stats = await Section.aggregate([
        { $match: { actCode } },
        {
            $group: {
                _id: null,
                totalSections: { $sum: 1 },
                archivedSections: { 
                    $sum: { $cond: ["$isArchived", 1, 0] } 
                },
                activeSections: {
                    $sum: { $cond: ["$isArchived", 0, 1] } 
                },
                uniqueChapters: { $addToSet: "$chapter" }
            }
        },
        {
            $project: {
                _id: 0,
                totalSections: 1,
                archivedSections: 1,
                activeSections: 1,
                totalChapters: { $size: "$uniqueChapters" }
            }
        }
    ]);

    const result = stats[0] || { totalSections: 0, archivedSections: 0, activeSections: 0, totalChapters: 0 };
    
    // Calculate avg sections per chapter
    const avgSectionsPerChapter = result.totalChapters > 0 
        ? (result.totalSections / result.totalChapters).toFixed(2) 
        : 0;

    return {
        actName: act.actName,
        actCode: act.actCode,
        ...result,
        avgSectionsPerChapter: Number(avgSectionsPerChapter)
    };
};

module.exports = {
    getAllActs,
    getActByCode,
    getActSections,
    getActChapters,
    getActStats
};
