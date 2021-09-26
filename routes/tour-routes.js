const express = require('express');
const toursController = require('../controllers/tour-controller')

const router = express.Router();

// router.param('id', toursController.checkTourId);

router.route('/top-5-cheap').get(toursController.aliasTopTours, toursController.getAllTours)

router.route('/')
    .get(toursController.getAllTours)
    .post(toursController.checkBody, toursController.addNewTour);
router.route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(toursController.deleteTourById);

module.exports = router;
