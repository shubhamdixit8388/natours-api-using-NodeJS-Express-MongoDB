const Review = require('../models/review-model');
const catchAsync = require('../utils/catch-async');
const factory = require('./handler-factory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = {tour: req.params.tourId};
  const reviews = await Review.find(filter);

  res.status(200).send({
    status: 'success',
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  console.log('req.user.id: ', req.user.id);
  const newReview = await Review.create(req.body);

  res.status(200).send({
    status: 'success',
    data: {
      review: newReview
    }
  });
})

exports.deleteReviewById = factory.deleteOne(Review);