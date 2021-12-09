const express = require('express');
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.route('')
    .get(authController.authenticateUser, reviewController.getAllReviews)
    .post(authController.authenticateUser, authController.checkUserRole('user'),
        reviewController.createReview);

module.exports = router;
