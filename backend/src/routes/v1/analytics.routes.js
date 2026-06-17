const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/analytics.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const {
    validateOverview,
    validateActDistribution,
    validateChaptersBreakdown,
    validateTopViewed,
    validateSearchTrends,
    validateUserGrowth,
    validateTopQueries,
    validateSearchLogs
} = require('../../validators/analytics.validator');

// All analytics endpoints require auth and admin role
router.use(protect);
router.use(restrictTo('admin'));

router.get('/overview', validateOverview, analyticsController.getOverview);
router.get('/acts', validateActDistribution, analyticsController.getActDistribution);
router.get('/chapters', validateChaptersBreakdown, analyticsController.getChaptersBreakdown);
router.get('/users', validateUserGrowth, analyticsController.getUserGrowth);
router.get('/top-viewed', validateTopViewed, analyticsController.getTopViewed);
router.get('/search-trends', validateSearchTrends, analyticsController.getSearchTrends);
router.get('/top-queries', validateTopQueries, analyticsController.getTopQueries);
router.get('/search-logs', validateSearchLogs, analyticsController.getSearchLogs);

module.exports = router;
