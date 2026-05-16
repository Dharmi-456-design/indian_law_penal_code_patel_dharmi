const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const searchService = require('../services/search.service');
const ApiError = require('../utils/ApiError');

const searchSections = asyncHandler(async (req, res) => {
    const { q, actCode, page, limit } = req.query;
    
    if (!q || q.length < 2) {
        throw new ApiError(400, 'Search query must be at least 2 characters long');
    }

    const { data, meta } = await searchService.searchLaws({
        q,
        actCode,
        page,
        limit,
        userId: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, data, 'Search results fetched successfully', meta)
    );
});

const globalSearch = asyncHandler(async (req, res) => {
    const { q, page, limit } = req.query;

    if (!q || q.length < 2) {
        throw new ApiError(400, 'Search query must be at least 2 characters long');
    }

    const { data, meta } = await searchService.globalSearch({
        q,
        page,
        limit,
        userId: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, data, 'Global search results fetched successfully', meta)
    );
});

const getSectionHistory = asyncHandler(async (req, res) => {
    const history = await searchService.getSectionHistory(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, history, 'Section history fetched successfully')
    );
});

const getSectionSummary = asyncHandler(async (req, res) => {
    const summary = await searchService.getSectionSummary(req.params.id);
    if (!summary) {
        throw new ApiError(404, 'Section not found');
    }
    return res.status(200).json(
        new ApiResponse(200, summary, 'Section summary fetched successfully')
    );
});

module.exports = {
    searchSections,
    globalSearch,
    getSectionHistory,
    getSectionSummary
};
