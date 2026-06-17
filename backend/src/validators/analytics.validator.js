const { query } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

const validateOverview = [
    validate
];

const validateActDistribution = [
    validate
];

const validateChaptersBreakdown = [
    query('actCode')
        .optional()
        .isString()
        .trim()
        .toUpperCase()
        .isLength({ min: 2, max: 10 })
        .withMessage('actCode must be a string between 2 and 10 characters'),
    validate
];

const validateTopViewed = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
        .toInt(),
    validate
];

const validateSearchTrends = [
    query('days')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('Days must be a positive integer between 1 and 365')
        .toInt(),
    validate
];

const validateUserGrowth = [
    query('months')
        .optional()
        .isInt({ min: 1, max: 24 })
        .withMessage('Months must be a positive integer between 1 and 24')
        .toInt(),
    validate
];

const validateTopQueries = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
        .toInt(),
    validate
];

const validateSearchLogs = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
        .toInt(),
    query('search')
        .optional()
        .isString()
        .trim(),
    validate
];

module.exports = {
    validateOverview,
    validateActDistribution,
    validateChaptersBreakdown,
    validateTopViewed,
    validateSearchTrends,
    validateUserGrowth,
    validateTopQueries,
    validateSearchLogs
};
