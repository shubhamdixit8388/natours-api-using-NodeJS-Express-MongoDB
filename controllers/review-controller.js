const Review = require('../models/review-model');
const catchAsync = require('../utils/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).send({
    status: 'success',
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  console.log('req.user.id: ', req.user.id);
  const newReview = await Review.create(req.body);

  res.status(200).send({
    status: 'success',
    data: {
      review: newReview
    }
  });
})
