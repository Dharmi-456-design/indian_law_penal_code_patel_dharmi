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

module.exports = {
    createSection,
    getSection,
    updateSection,
    archiveSection,
    restoreSection,
    deleteSection
};
