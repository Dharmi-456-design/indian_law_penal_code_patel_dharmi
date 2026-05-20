const Section = require('../models/Section.models');
const ApiError = require('../utils/ApiError');
const { buildPaginationMeta, buildSortObj } = require('../utils/paginationUtil');
const { buildSectionFilter } = require('../utils/filterBuilder');

/**
 * Create a new legal section
 */
const createSection = async (sectionData) => {
    const existing = await Section.findOne({
        actCode: sectionData.actCode,
        sectionNumber: sectionData.sectionNumber
    });

    if (existing) {
        throw new ApiError(400, 'Section already exists in this act');
    }

    const section = await Section.create(sectionData);
    return section;
};

/**
 * Get section by ID and increment view count
 */
const getSectionById = async (id) => {
    const section = await Section.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true, runValidators: true }
    );

    if (!section || section.isArchived) {
        throw new ApiError(404, 'Section not found');
    }

    return section;
};

/**
 * Update section details
 */
const updateSection = async (id, updateData) => {
    const section = await Section.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!section) {
        throw new ApiError(404, 'Section not found');
    }

    return section;
};

/**
 * Soft delete (archive) section
 */
const archiveSection = async (id) => {
    const section = await Section.findByIdAndUpdate(
        id,
        { isArchived: true },
        { new: true }
    );

    if (!section) {
        throw new ApiError(404, 'Section not found');
    }

    return section;
};

/**
 * Restore archived section
 */
const restoreSection = async (id) => {
    const section = await Section.findByIdAndUpdate(
        id,
        { isArchived: false },
        { new: true }
    );

    if (!section) {
        throw new ApiError(404, 'Section not found');
    }

    return section;
};

/**
 * Permanently delete section (Admin)
 */
const deleteSectionPermanently = async (id) => {
    const section = await Section.findByIdAndDelete(id);

    if (!section) {
        throw new ApiError(404, 'Section not found');
    }

    return section;
};

/**
 * Replace entire section (PUT)
 */
const replaceSection = async (id, sectionData) => {
    const section = await Section.findOneAndReplace({ _id: id }, sectionData, { new: true });
    if (!section) throw new ApiError(404, 'Section not found');
    return section;
};

/**
 * Check if a section exists
 */
const checkExists = async (id) => {
    const section = await Section.exists({ _id: id, isArchived: false });
    return !!section;
};

/**
 * Get all sections with pagination, filtering and sorting
 */
const getAllSections = async (queryParams) => {
    const { page = 1, limit = 20, sortBy, sortOrder } = queryParams;

    const filter = buildSectionFilter(queryParams);
    const sort = buildSortObj(sortBy, sortOrder);
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
        Section.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v'),
        Section.countDocuments(filter)
    ]);

    const meta = buildPaginationMeta(total, Number(page), Number(limit));

    return { data, meta };
};

/**
 * Get a random non-archived section
 */
const getRandomSection = async () => {
    const count = await Section.countDocuments({ isArchived: false });
    if (count === 0) return null;
    
    const random = Math.floor(Math.random() * count);
    const section = await Section.findOne({ isArchived: false })
        .skip(random)
        .select('-__v');
        
    return section;
};

/**
 * Get top viewed (trending) sections
 */
const getTrendingSections = async (limit = 10) => {
    return await Section.find({ isArchived: false })
        .sort({ viewCount: -1 })
        .limit(Number(limit))
        .select('-__v');
};

/**
 * Get recently created sections
 */
const getRecentSections = async (limit = 10) => {
    return await Section.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .select('-__v');
};

module.exports = {
    createSection,
    getSectionById,
    updateSection,
    replaceSection,
    archiveSection,
    restoreSection,
    deleteSectionPermanently,
    checkExists,
    getAllSections,
    getRandomSection,
    getTrendingSections,
    getRecentSections
};
