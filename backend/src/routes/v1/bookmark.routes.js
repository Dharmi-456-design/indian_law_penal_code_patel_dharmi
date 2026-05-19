const express = require('express');
const router = express.Router();
const bookmarkController = require('../../controllers/bookmark.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { 
    validateSectionId, 
    validateNoteUpdate, 
    validateGetBookmarks 
} = require('../../validators/bookmark.validator');

// All bookmark routes require authentication
router.use(protect);

router.route('/')
    .get(validateGetBookmarks, bookmarkController.getUserBookmarks);

router.route('/:sectionId')
    .post(validateSectionId, bookmarkController.addBookmark)
    .delete(validateSectionId, bookmarkController.removeBookmark);

router.patch('/:sectionId/note', validateNoteUpdate, bookmarkController.updateBookmarkNote);
router.get('/:sectionId/check', validateSectionId, bookmarkController.checkBookmark);

module.exports = router;
