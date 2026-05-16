const Section = require('../models/Section.models');
const SearchLog = require('../models/SearchLog.models');
const AuditLog = require('../models/AuditLog.models');
const { buildPaginationMeta } = require('../utils/paginationUtil');

/**
 * Search laws using text index with relevance scoring
 */
const searchLaws = async ({ q, actCode, page = 1, limit = 20, userId = null }) => {
    let filter = { isArchived: false };
    if (actCode) filter.actCode = actCode;

    // Add text search
    const textFilter = { ...filter, $text: { $search: q } };

    const skip = (Number(page) - 1) * Number(limit);

    // Try text search first
    let [data, total] = await Promise.all([
        Section.find(textFilter, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(Number(limit))
            .select('-__v'),
        Section.countDocuments(textFilter)
    ]);

    // Fallback to regex search if no results found
    if (total === 0) {
        const regex = new RegExp(q, 'i');
        const regexFilter = {
            ...filter,
            $or: [
                { sectionTitle: { $regex: regex } },
                { sectionDesc: { $regex: regex } },
                { sectionNumber: { $regex: regex } }
            ]
        };

        [data, total] = await Promise.all([
            Section.find(regexFilter)
                .sort({ sectionNumber: 1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-__v'),
            Section.countDocuments(regexFilter)
        ]);
    }

    // Log the search
    await SearchLog.create({
        userId,
        query: q,
        actCode: actCode || 'GLOBAL',
        resultsCount: total
    });

    const meta = buildPaginationMeta(total, Number(page), Number(limit));

    return { data, meta };
};

/**
 * Global search across all acts
 */
const globalSearch = async ({ q, page = 1, limit = 20, userId = null }) => {
    return await searchLaws({ q, page, limit, userId });
};

/**
 * Search by exact section number within an act
 */
const searchBySection = async ({ actCode, sectionNumber }) => {
    return await Section.findOne({
        actCode,
        sectionNumber: sectionNumber.trim(),
        isArchived: false
    }).select('-__v');
};

/**
 * Get all sections within a chapter of an act
 */
const searchByChapter = async ({ actCode, chapter }) => {
    return await Section.find({
        actCode,
        chapter: Number(chapter),
        isArchived: false
    }).sort({ sectionNumber: 1 }).select('-__v');
};

/**
 * Get section history from audit logs
 */
const getSectionHistory = async (id) => {
    return await AuditLog.find({
        targetCollection: 'Section',
        targetId: id
    }).sort({ createdAt: -1 });
};

/**
 * Get section summary (placeholder or specific fields)
 */
const getSectionSummary = async (id) => {
    const section = await Section.findById(id).select('actCode sectionNumber sectionTitle sectionDesc');
    if (!section) return null;

    // Simple summary: first 200 chars of description
    return {
        id: section._id,
        actCode: section.actCode,
        sectionNumber: section.sectionNumber,
        title: section.sectionTitle,
        summary: section.sectionDesc.substring(0, 200) + '...'
    };
};

module.exports = {
    searchLaws,
    globalSearch,
    searchBySection,
    searchByChapter,
    getSectionHistory,
    getSectionSummary
};
