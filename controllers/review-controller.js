const Review = require('../models/review-model');
const factory = require('./handler-factory');

exports.setTourUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

exports.createReview = factory.addOne(Review);
exports.getReviewById = factory.getOne(Review);
exports.updateReviewById = factory.updateOne(Review);
exports.deleteReviewById = factory.deleteOne(Review);
exports.getAllReviews = factory.getAll(Review);
