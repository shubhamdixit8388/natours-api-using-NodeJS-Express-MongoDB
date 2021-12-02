const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.addNewUser);
router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUserById);

module.exports = router;
