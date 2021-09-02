const express = require('express');
const toursController = require('../controllers/tour-controller')

const router = express.Router();

router.route('/')
    .get(toursController.getAllTours)
    .post(toursController.addNewTour);
router.route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(toursController.deleteTourById);

module.exports = router;
