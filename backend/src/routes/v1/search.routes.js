const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/search.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { globalSearchValidator } = require('../../validators/search.validator');

// Optional authentication for search (logs userId if available)
router.get('/global', (req, res, next) => {
    // Try to protect but don't fail if no token (optional auth)
    protect(req, res, (err) => {
        next();
    });
}, globalSearchValidator, validate, searchController.globalSearch);

module.exports = router;
