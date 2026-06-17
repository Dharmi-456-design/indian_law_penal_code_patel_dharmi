const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getMe, logout, updateProfile, changePassword } = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../../validators/auth.validator');
const validate = require('../../middlewares/validate.middleware');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
