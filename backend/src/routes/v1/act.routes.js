const express = require('express');
const router = express.Router();
const actController = require('../../controllers/act.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Protect all acts routes
router.use(protect);

router.get('/', actController.getAllActs);
router.get('/:actCode', actController.getActByCode);
router.get('/:actCode/sections', actController.getActSections);
router.get('/:actCode/chapters', actController.getActChapters);
router.get('/:actCode/stats', actController.getActStats);

module.exports = router;
