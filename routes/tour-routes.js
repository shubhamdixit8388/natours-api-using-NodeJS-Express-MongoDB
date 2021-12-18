const express = require('express');
const toursController = require('../controllers/tour-controller')
const authController = require('../controllers/auth-controller')
const reviewRoutes = require('../routes/review-routes')

const router = express.Router();

// GET /tours/<tourId>/reviews
// GET /tours/<tourId>/reviews/<userId>

// router.route('/:tourId/reviews')
//     .post(authController.authenticateUser, authController.checkUserRole('user'),
//         reviewController.createReview);

router.use('/:tourId/reviews', reviewRoutes)

router.route('/top-5-cheap').get(toursController.aliasTopTours, toursController.getAllTours)

router.route('/tour-within/:distance/center/:latLang/unit/:distanceUnit')
    .get(toursController.getToursWithinArea);
router.route('/distances/:latLang/unit/:distanceUnit')
    .get(toursController.getTourDistancesFromSpecificLocation);

router.route('/')
    .get(toursController.getAllTours)
    .post(authController.authenticateUser, authController.checkUserRole('admin', 'lead-guide'),
        toursController.addNewTour);
router.route('/:id')
    .get(toursController.getTourById)
    .patch(authController.authenticateUser, authController.checkUserRole('admin', 'lead-guide'),
        toursController.uploadTourPhotos, toursController.resizeTourImages, toursController.updateTour)
    .delete(authController.authenticateUser, authController.checkUserRole('admin', 'lead-guide'),
        toursController.deleteTourById);

module.exports = router;
