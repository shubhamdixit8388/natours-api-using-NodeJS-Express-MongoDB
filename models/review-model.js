const mongoose = require('mongoose');

const Tour = require('./tour-model.js');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

reviewSchema.index({tour: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const states = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group: {
        _id: '$tour',
        numberOfRating: {$sum: 1},
        averageRatings: {$avg: '$rating'}
      }
    }
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: states && states.length > 0 ? states[0].averageRatings : 4.5,
    ratingsQuantity: states && states.length > 0 ? states[0].numberOfRating : 0
  });
}

// We want to update averageRatings and numberOfRating for update
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRatings(this.tour);
});

// We want to update and delete averageRatings and numberOfRating for update
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
})
reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
