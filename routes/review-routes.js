const express = require('express');
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

// Using mergeParams we can can upper route params like tourId in current params method createReview
const router = express.Router({mergeParams: true});

// POST /tours/<tourId>/reviews
router.route('')
    .get(authController.authenticateUser, reviewController.getAllReviews)
    .post(authController.authenticateUser, reviewController.setTourUserId, reviewController.createReview);

router.route('/:id')
    .delete(authController.authenticateUser, authController.checkUserRole('admin'),
    reviewController.deleteReviewById)
    .patch(authController.authenticateUser, reviewController.updateReviewById);

module.exports = router;
