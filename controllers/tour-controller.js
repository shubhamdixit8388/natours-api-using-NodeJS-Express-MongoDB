const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkTourId = (req, res, next, value) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id)
  if (!requestedTour) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (!(req.body.name && req.body.price)) {
    return res.status(400).send({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
}

exports.getAllTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.addNewTour = (req, res) => {
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

exports.getTourById = (req, res) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id)
  res.status(200).send({
    status: 'success',
    data: {
      tour: requestedTour
    }
  });
};

exports.updateTour = (req, res) => {
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id);
  res.status(200).send({
    status: 'success',
    data: {
      tour: requestedTour
    }
  });
};

exports.deleteTourById = (req, res) => {
  res.status(204).send({
    status: 'success',
    data: null
  });
};
