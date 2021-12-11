const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router.route('/update-password').patch(authController.authenticateUser, authController.updatePassword);

router.route('/me').patch(authController.authenticateUser, userController.updateMe);
router.route('/me').delete(authController.authenticateUser, userController.deleteMe);
router.route('/me').get(authController.authenticateUser, userController.getMe,
    userController.getUserById)

router.route('/')
    .get(authController.authenticateUser, authController.checkUserRole('admin'),
        userController.getAllUsers)
    .post(authController.authenticateUser, authController.checkUserRole('admin'),
        userController.addNewUser);
router.route('/:id')
    .get(authController.authenticateUser, userController.getUserById)
    .patch(authController.authenticateUser, authController.checkUserRole('admin'),
        userController.updateUser)
    .delete(authController.authenticateUser, authController.checkUserRole('admin'),
        userController.deleteUserById);

module.exports = router;
