const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./user-model');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    minlength: 10
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    max: 5,
    min: 0,
    set: value => Math.round(value * 10) / 10 // 4.6666 => 46.666 => 47 => 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  secretTour: {
    type: Boolean,
    default: false
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

// Indexing to improve read performance
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
})

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE - runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true})
  next();
});

// Embedding in mongoDB
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// })

tourSchema.post('save', function (document, next) {
  // console.log(document);
  next();
})

// QUERY Middleware - e.g. find, findOneAndUpdate, etc.
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
