const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);

// Creating middleware of authenticate user so that it will applicable to all API's below this middleware
router.use(authController.authenticateUser)

router.route('/update-password').patch(authController.updatePassword);

router.route('/me').patch(userController.updateMe);
router.route('/me').delete(userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUserById)

// Creating middleware to check user is admin or not, If user is admin then we allow user to do following actions
router.use(authController.checkUserRole('admin'))

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.addNewUser);
router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUserById);

module.exports = router;
