const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

router.use(protect);

router.patch('/me', userController.updateProfile);

router.use(restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers);

router.get('/stats', userController.getUserStats);

router.route('/:id')
    .get(userController.getUserById)
    .delete(userController.deleteUser);

router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.toggleUserStatus);

module.exports = router;
