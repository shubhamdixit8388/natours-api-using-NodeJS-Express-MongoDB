const Tour = require('../models/tour-model');
const factory = require('./handler-factory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
}

exports.addNewTour = factory.addOne(Tour);
exports.getTourById = factory.getOne(Tour, ['reviews', {
  path: 'guides',
  select: '-__v -passwordChangedAt'
}]);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTourById = factory.deleteOne(Tour);
exports.getAllTours = factory.getAll(Tour);
