const express = require('express');
const toursController = require('../controllers/tour-controller')
const authController = require('../controllers/auth-controller')
const reviewController = require('../controllers/review-controller')

const router = express.Router();

// router.param('id', toursController.checkTourId);

router.route('/top-5-cheap').get(toursController.aliasTopTours, toursController.getAllTours)

router.route('/')
    .get(toursController.getAllTours)
    .post(toursController.checkBody, toursController.addNewTour);
router.route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(authController.authenticateUser, authController.checkUserRole('admin', 'lead-guide'), toursController.deleteTourById);

// POST /tours/<tourId>/reviews
// GET /tours/<tourId>/reviews
// GET /tours/<tourId>/reviews/<userId>

router.route('/:tourId/reviews')
    .post(authController.authenticateUser, authController.checkUserRole('user'),
        reviewController.createReview);

module.exports = router;
