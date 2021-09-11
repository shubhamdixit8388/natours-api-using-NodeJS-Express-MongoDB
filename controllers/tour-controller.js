const Tour = require('../models/tour-model');

exports.checkBody = (req, res, next) => {
  // if (!(req.body.name && req.body.price)) {
  //   return res.status(400).send({
  //     status: 'fail',
  //     message: 'Missing name or price'
  //   });
  // }
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).send({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    })
  }

};

exports.addNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    // const tour = await Tour.findOne({_id: req.params.id});
    const tour = await Tour.findById(req.params.id);
    res.status(200).send({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).send({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: 'success'
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};
