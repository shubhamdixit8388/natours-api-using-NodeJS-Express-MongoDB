const express = require('express');
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

// Using mergeParams we can can upper route params like tourId in current params method createReview
const router = express.Router({mergeParams: true});

// Creating middleware of authenticate user so that it will applicable to all API's below this middleware
router.use(authController.authenticateUser);

// POST /tours/<tourId>/reviews
router.route('')
    .get(reviewController.getAllReviews)
    .post(authController.checkUserRole('admin'), reviewController.setTourUserId, reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReviewById)
    .delete(authController.checkUserRole('admin', 'lead-guide'), reviewController.deleteReviewById)
    .patch(authController.checkUserRole('admin', 'lead-guide'), reviewController.updateReviewById);

module.exports = router;
