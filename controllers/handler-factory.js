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
