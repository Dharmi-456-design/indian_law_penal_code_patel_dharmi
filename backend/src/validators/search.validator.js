const { query, param } = require('express-validator');

const searchValidator = [
    query('q')
        .trim()
        .notEmpty().withMessage('Search query is required')
        .isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
    query('actCode').optional().isIn(['NIA', 'MVA', 'IEA', 'IPC', 'IDA', 'HMA', 'CrPC', 'CPC']).withMessage('Invalid actCode'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

const globalSearchValidator = [
    query('q')
        .trim()
        .notEmpty().withMessage('Search query is required')
        .isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

const sectionIdParamValidator = [
    param('id').isMongoId().withMessage('Invalid section ID format')
];

module.exports = {
    searchValidator,
    globalSearchValidator,
    sectionIdParamValidator
};
