const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const actService = require('../services/act.service');

const getAllActs = asyncHandler(async (req, res) => {
    const acts = await actService.getAllActs();
    return res.status(200).json(
        new ApiResponse(200, acts, 'Acts retrieved successfully')
    );
});

const getActByCode = asyncHandler(async (req, res) => {
    const { actCode } = req.params;
    const act = await actService.getActByCode(actCode);
    return res.status(200).json(
        new ApiResponse(200, act, 'Act retrieved successfully')
    );
});

const getActSections = asyncHandler(async (req, res) => {
    const { actCode } = req.params;
    const { page, limit } = req.query;
    
    const { data, meta } = await actService.getActSections(actCode, page, limit);
    return res.status(200).json(
        new ApiResponse(200, data, 'Act sections retrieved successfully', meta)
    );
});

const getActChapters = asyncHandler(async (req, res) => {
    const { actCode } = req.params;
    const chapters = await actService.getActChapters(actCode);
    return res.status(200).json(
        new ApiResponse(200, chapters, 'Act chapters retrieved successfully')
    );
});

const getActStats = asyncHandler(async (req, res) => {
    const { actCode } = req.params;
    const stats = await actService.getActStats(actCode);
    return res.status(200).json(
        new ApiResponse(200, stats, 'Act stats retrieved successfully')
    );
});

module.exports = {
    getAllActs,
    getActByCode,
    getActSections,
    getActChapters,
    getActStats
};
