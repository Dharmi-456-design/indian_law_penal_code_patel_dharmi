const { body, param } = require('express-validator');

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

module.exports = {
    validateSectionId,
    createSectionValidator,
    updateSectionValidator
};
