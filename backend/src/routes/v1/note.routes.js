const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/note.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

// All note routes require authentication
router.use(protect);

// Validators
const validateCreateNote = [
    body('sectionId')
        .notEmpty().withMessage('sectionId is required')
        .isMongoId().withMessage('sectionId must be a valid MongoDB ObjectId'),
    body('noteText')
        .notEmpty().withMessage('noteText is required')
        .isString().withMessage('noteText must be a string'),
    validate
];

const validateUpdateNote = [
    param('id')
        .isMongoId().withMessage('Note id must be a valid MongoDB ObjectId'),
    body('noteText')
        .notEmpty().withMessage('noteText is required')
        .isString().withMessage('noteText must be a string'),
    validate
];

const validateNoteId = [
    param('id')
        .isMongoId().withMessage('Note id must be a valid MongoDB ObjectId'),
    validate
];

// Routes
router.route('/')
    .get(noteController.getUserNotes)
    .post(validateCreateNote, noteController.createNote);

router.route('/:id')
    .put(validateUpdateNote, noteController.updateNote)
    .delete(validateNoteId, noteController.removeNote);

module.exports = router;
