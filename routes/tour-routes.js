const express = require('express');
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
};

const getTourById = (req, res) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id)
  if (requestedTour) {
    res.status(200).send({
      status: 'success',
      data: {
        tour: requestedTour
      }
    });
  } else {
    res.status(404).send({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
};

const updateTour = (req, res) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id)
  if (!requestedTour) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour: requestedTour
    }
  });
};

const deleteTourById = (req, res) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id)
  if (!requestedTour) {
    res.status(404).send({
      status: 'fail',
      message: 'Invalid ID'
    });
  } else {
    res.status(204).send({
      status: 'success',
      data: null
    });
  }
};

const router = express.Router();

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTourById);

module.exports = router;
