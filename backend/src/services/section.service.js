const Section = require('../models/Section.models');
const ApiError = require('../utils/ApiError');

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
    const section = await Section.findByIdAndReplace(id, sectionData, { new: true });
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

module.exports = {
    createSection,
    getSectionById,
    updateSection,
    replaceSection,
    archiveSection,
    restoreSection,
    deleteSectionPermanently,
    checkExists
};
