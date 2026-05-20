const express = require('express');
const router = express.Router();
const sectionController = require('../../controllers/section.controller');
const searchController = require('../../controllers/search.controller');
const actController = require('../../controllers/act.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
    validateSectionId,
    createSectionValidator,
    updateSectionValidator,
    sectionQueryValidator
} = require('../../validators/section.validator');
const { searchValidator, sectionIdParamValidator } = require('../../validators/search.validator');

// All routes require authentication
router.use(protect);

// Publicly readable (authenticated users)
router.get('/', sectionQueryValidator, validate, sectionController.getAllSections);
router.get('/search', searchValidator, validate, searchController.searchSections);
router.get('/act/:actCode', actController.getActSections);
router.get('/recent', sectionController.getRecentSections);
router.get('/trending', sectionController.getTrendingSections);
router.get('/random', sectionController.getRandomSection);

// Admin archived sections route (placed before :id wildcard to prevent routing collision)
router.get('/archived', restrictTo('admin'), sectionQueryValidator, validate, sectionController.getArchivedSections);

router.get('/:id', validateSectionId, validate, sectionController.getSection);
router.get('/:id/exists', validateSectionId, validate, sectionController.checkExists);
router.get('/:id/history', sectionIdParamValidator, validate, searchController.getSectionHistory);
router.get('/:id/summary', sectionIdParamValidator, validate, searchController.getSectionSummary);

// Admin only operations
router.use(restrictTo('admin'));

router.post('/', createSectionValidator, validate, sectionController.createSection);

router.route('/:id')
    .put(updateSectionValidator, validate, sectionController.replaceSection)
    .patch(updateSectionValidator, validate, sectionController.updateSection)
    .delete(validateSectionId, validate, sectionController.deleteSection);

router.patch('/:id/archive', validateSectionId, validate, sectionController.archiveSection);
router.patch('/:id/restore', validateSectionId, validate, sectionController.restoreSection);

module.exports = router;
