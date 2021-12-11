const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');

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
    data: {
      doc
    }
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
    data: {
      doc
    }
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
    data: {
      doc
    }
  });
});
