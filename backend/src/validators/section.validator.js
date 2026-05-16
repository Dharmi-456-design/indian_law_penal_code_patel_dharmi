const { body, param, query } = require('express-validator');

const validateSectionId = [
    param('id').isMongoId().withMessage('Invalid section ID format')
];

const createSectionValidator = [
    body('actCode')
        .trim()
        .notEmpty().withMessage('actCode is required')
        .isIn(['NIA', 'MVA', 'IEA', 'IPC', 'IDA', 'HMA', 'CrPC', 'CPC']).withMessage('Invalid actCode'),
    
    body('actName')
        .trim()
        .notEmpty().withMessage('actName is required'),
    
    body('sectionNumber')
        .trim()
        .notEmpty().withMessage('sectionNumber is required'),
    
    body('sectionTitle')
        .trim()
        .notEmpty().withMessage('sectionTitle is required'),
    
    body('sectionDesc')
        .trim()
        .notEmpty().withMessage('sectionDesc is required'),
    
    body('actYear').optional().isNumeric().withMessage('actYear must be a number'),
    body('chapter').optional().isNumeric().withMessage('chapter must be a number'),
    body('chapterTitle').optional().trim()
];

const updateSectionValidator = [
    ...validateSectionId,
    body('actCode').optional().isIn(['NIA', 'MVA', 'IEA', 'IPC', 'IDA', 'HMA', 'CrPC', 'CPC']),
    body('actYear').optional().isNumeric(),
    body('chapter').optional().isNumeric(),
    body('sectionNumber').optional().trim().notEmpty(),
    body('sectionTitle').optional().trim().notEmpty(),
    body('sectionDesc').optional().trim().notEmpty()
];

const sectionQueryValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('actCode').optional().isIn(['NIA', 'MVA', 'IEA', 'IPC', 'IDA', 'HMA', 'CrPC', 'CPC']).withMessage('Invalid actCode'),
    query('chapter').optional().isNumeric().withMessage('Chapter must be a number'),
    query('sortBy').optional().trim(),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
    query('isArchived').optional().isBoolean().withMessage('isArchived must be a boolean')
];

module.exports = {
    validateSectionId,
    createSectionValidator,
    updateSectionValidator,
    sectionQueryValidator
};
