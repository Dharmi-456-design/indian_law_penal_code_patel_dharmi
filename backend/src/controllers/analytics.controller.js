const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analytics.service');

const getOverview = asyncHandler(async (req, res) => {
    const stats = await analyticsService.getPlatformStats();
    return res.status(200).json(
        new ApiResponse(200, stats, 'Platform overview statistics retrieved successfully')
    );
});

const getActDistribution = asyncHandler(async (req, res) => {
    const distribution = await analyticsService.getActDistribution();
    return res.status(200).json(
        new ApiResponse(200, distribution, 'Act distribution retrieved successfully')
    );
});

const getChaptersBreakdown = asyncHandler(async (req, res) => {
    const { actCode } = req.query;
    const breakdown = await analyticsService.getChaptersBreakdown(actCode);
    return res.status(200).json(
        new ApiResponse(200, breakdown, 'Chapters breakdown retrieved successfully')
    );
});

const getTopViewed = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const topViewed = await analyticsService.getTopViewedLaws(limit);
    return res.status(200).json(
        new ApiResponse(200, topViewed, 'Top viewed laws retrieved successfully')
    );
});

const getSearchTrends = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const trends = await analyticsService.getSearchTrends(days);
    return res.status(200).json(
        new ApiResponse(200, trends, 'Search trends retrieved successfully')
    );
});

const getUserGrowth = asyncHandler(async (req, res) => {
    const { months } = req.query;
    const growth = await analyticsService.getUserGrowth(months);
    return res.status(200).json(
        new ApiResponse(200, growth, 'User growth data retrieved successfully')
    );
});

const getTopQueries = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const topQueries = await analyticsService.getTopSearchQueries(limit);
    return res.status(200).json(
        new ApiResponse(200, topQueries, 'Top search queries retrieved successfully')
    );
});

module.exports = {
    getOverview,
    getActDistribution,
    getChaptersBreakdown,
    getUserGrowth,
    getTopViewed,
    getSearchTrends,
    getTopQueries
};
