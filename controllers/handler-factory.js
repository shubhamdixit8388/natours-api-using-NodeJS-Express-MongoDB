const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const APIFeatures = require('./../utils/api-features');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if(!doc) {
    return next(new AppError('No document found with this id', 404));
  }

  res.status(204).send({
    status: 'success'
  });
});

exports.addOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).send({
    status: 'success',
    data: doc
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if(!doc) {
    return next(new AppError('No document found with this id', 404));
  }
  res.status(200).send({
    status: 'success',
    data: doc
  });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (populateOptions) {
    populateOptions.forEach(populateOption => {
      query = query.populate(populateOption);
    });
  }
  const doc = await query;
  if(!doc) {
    return next(new AppError('No document found with this id', 404));
  }
  res.status(200).send({
    status: 'success',
    data: doc
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  // To allow nested GET reviews on tour (kind of hack)
  let filter = {};
  if (req.params.tourId) filter = {tour: req.params.tourId};

  const featuresApi = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldSelection()
      .pagination();
  // Execute query
  const docs = await featuresApi.query;

  // Chaining to query
  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

  res.status(200).send({
    status: 'success',
    results: docs.length,
    data: docs
  });
});
