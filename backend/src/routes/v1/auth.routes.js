const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../../validators/auth.validator');
const validate = require('../../middlewares/validate.middleware');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
