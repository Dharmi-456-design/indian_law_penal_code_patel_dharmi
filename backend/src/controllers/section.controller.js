const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const sectionService = require('../services/section.service');
const AuditLog = require('../models/AuditLog.models');

/**
 * Helper to log admin actions
 */
const logAdminAction = async (adminId, action, targetId, details, ip) => {
    try {
        await AuditLog.create({
            adminId,
            action,
            targetCollection: 'Section',
            targetId,
            details,
            ip
        });
    } catch (error) {
        console.error('Audit logging failed:', error);
    }
};

const createSection = asyncHandler(async (req, res) => {
    const section = await sectionService.createSection(req.body);
    
    await logAdminAction(
        req.user._id,
        'CREATE',
        section._id,
        `Created section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(201).json(
        new ApiResponse(201, section, 'Section created successfully')
    );
});

const getSection = asyncHandler(async (req, res) => {
    const section = await sectionService.getSectionById(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, section, 'Section fetched successfully')
    );
});

const updateSection = asyncHandler(async (req, res) => {
    const section = await sectionService.updateSection(req.params.id, req.body);
    
    await logAdminAction(
        req.user._id,
        'UPDATE',
        section._id,
        `Updated section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(200).json(
        new ApiResponse(200, section, 'Section updated successfully')
    );
});

const archiveSection = asyncHandler(async (req, res) => {
    const section = await sectionService.archiveSection(req.params.id);
    
    await logAdminAction(
        req.user._id,
        'ARCHIVE',
        section._id,
        `Archived section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(200).json(
        new ApiResponse(200, section, 'Section archived successfully')
    );
});

const restoreSection = asyncHandler(async (req, res) => {
    const section = await sectionService.restoreSection(req.params.id);
    
    await logAdminAction(
        req.user._id,
        'RESTORE',
        section._id,
        `Restored section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(200).json(
        new ApiResponse(200, section, 'Section restored successfully')
    );
});

const deleteSection = asyncHandler(async (req, res) => {
    const section = await sectionService.deleteSectionPermanently(req.params.id);
    
    await logAdminAction(
        req.user._id,
        'DELETE',
        section._id,
        `Permanently deleted section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(200).json(
        new ApiResponse(200, null, 'Section deleted permanently')
    );
});

const replaceSection = asyncHandler(async (req, res) => {
    const section = await sectionService.replaceSection(req.params.id, req.body);
    
    await logAdminAction(
        req.user._id,
        'REPLACE',
        section._id,
        `Replaced section ${section.sectionNumber} of ${section.actCode}`,
        req.ip
    );

    return res.status(200).json(
        new ApiResponse(200, section, 'Section replaced successfully')
    );
});

const checkExists = asyncHandler(async (req, res) => {
    const exists = await sectionService.checkExists(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, { exists }, 'Existence check completed')
    );
});

const getAllSections = asyncHandler(async (req, res) => {
    const { data, meta } = await sectionService.getAllSections(req.query);
    return res.status(200).json(
        new ApiResponse(200, data, 'Sections fetched successfully', meta)
    );
});

const getRecentSections = asyncHandler(async (req, res) => {
    const sections = await sectionService.getRecentSections(req.query.limit);
    return res.status(200).json(
        new ApiResponse(200, sections, 'Recent sections fetched successfully')
    );
});

const getTrendingSections = asyncHandler(async (req, res) => {
    const sections = await sectionService.getTrendingSections(req.query.limit);
    return res.status(200).json(
        new ApiResponse(200, sections, 'Trending sections fetched successfully')
    );
});

const getRandomSection = asyncHandler(async (req, res) => {
    const section = await sectionService.getRandomSection();
    return res.status(200).json(
        new ApiResponse(200, section, 'Random section fetched successfully')
    );
});

const getArchivedSections = asyncHandler(async (req, res) => {
    // Force isArchived to true for this endpoint
    const query = { ...req.query, isArchived: 'true' };
    const { data, meta } = await sectionService.getAllSections(query);
    return res.status(200).json(
        new ApiResponse(200, data, 'Archived sections fetched successfully', meta)
    );
});

module.exports = {
    createSection,
    getSection,
    updateSection,
    replaceSection,
    archiveSection,
    restoreSection,
    deleteSection,
    checkExists,
    getAllSections,
    getRecentSections,
    getTrendingSections,
    getRandomSection,
    getArchivedSections
};
