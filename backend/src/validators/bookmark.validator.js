const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const mongoose = require('mongoose');

// Helper to validate MongoDB ObjectId
const isValidObjectId = (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};

// Validate sectionId in URL params
const validateSectionId = [
    param('sectionId')
        .custom(isValidObjectId)
        .withMessage('Valid section ID is required'),
    validate
];

// Validate note payload for PATCH request
const validateNoteUpdate = [
    param('sectionId')
        .custom(isValidObjectId)
        .withMessage('Valid section ID is required'),
    body('note')
        .isString()
        .withMessage('Note must be a string')
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Note cannot exceed 1000 characters'),
    validate
];

// Validate query params for GET bookmarks list
const validateGetBookmarks = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('actCode')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2 }),
    validate
];

module.exports = {
    validateSectionId,
    validateNoteUpdate,
    validateGetBookmarks
};
