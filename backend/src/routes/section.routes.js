const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    validateSectionId,
    createSectionValidator,
    updateSectionValidator
} = require('../validators/section.validator');

// All routes require authentication
router.use(protect);

// Publicly readable (authenticated users)
router.get('/:id', validateSectionId, validate, sectionController.getSection);

// Admin only operations
router.use(restrictTo('admin'));

router.post('/', createSectionValidator, validate, sectionController.createSection);

router.route('/:id')
    .put(updateSectionValidator, validate, sectionController.updateSection)
    .delete(validateSectionId, validate, sectionController.deleteSection);

router.patch('/:id/archive', validateSectionId, validate, sectionController.archiveSection);
router.patch('/:id/restore', validateSectionId, validate, sectionController.restoreSection);

module.exports = router;
