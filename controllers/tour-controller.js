const Tour = require('../models/tour-model');
const APIFeatures = require('./../utils/api-features');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  const featuresApi = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldSelection()
      .pagination();
  // Execute query
  const tours = await featuresApi.query;

  // Chaining to query
  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

  // Send response
  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.addNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).send({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findOne({_id: req.params.id});
  // const tour = await Tour.findById(req.params.id).populate('guides');
  const tour = await Tour.findById(req.params.id).populate('reviews').populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  if(!tour) {
     return next(new AppError('No tour found with this id', 404));
  }

  res.status(200).send({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });
//
//   if(!tour) {
//     return next(new AppError('No tour found with this id', 404));
//   }
//
//   res.status(200).send({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });
exports.updateTour = factory.updateOne(Tour);

// exports.deleteTourById = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//
//   if(!tour) {
//     return next(new AppError('No tour found with this id', 404));
//   }
//
//   res.status(204).send({
//     status: 'success'
//   });
// });

exports.deleteTourById = factory.deleteOne(Tour);
