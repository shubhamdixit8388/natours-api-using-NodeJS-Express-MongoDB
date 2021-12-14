const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../models/tour-model');
const factory = require('./handler-factory');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true)
  } else {
    callback(new AppError('Please upload only image file', 400), false);
  }
  callback(null, 'public/img/users');
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// upload.single('imageCover'); -> req.file
// upload.array('images', 5); -> req.files
exports.uploadTourPhotos = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3}
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1. Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/tours/${req.body.imageCover}`);
  req.body.images = [];
  await Promise.all(
      req.files.images.map(async (file, index) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public/img/tours/${fileName}`);
        req.body.images.push(fileName);
      })
  )
  next();
});

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

// /tour-within/:distance/center/:latLang/unit/:distanceUnit
// /tour-within/122/center/39.3509001,-112.1882077/unit/mi
exports.getToursWithinArea = catchAsync(async (req, res, next) => {
  const {distance, latLang, distanceUnit} = req.params;
  const [latitude, longitude] = latLang.split(',');

  if (!(latitude && longitude)) {
    return next(new AppError('Please provide latitude and longitude in correct format i.e. lat,lang', 400));
  }
  const radius = distanceUnit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
  });

  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: tours
  });
});

exports.getTourDistancesFromSpecificLocation = catchAsync(async (req, res, next) => {
  const {latLang, distanceUnit} = req.params;
  const [latitude, longitude] = latLang.split(',');

  if (!(latitude && longitude)) {
    return next(new AppError('Please provide latitude and longitude in correct format i.e. lat,lang', 400));
  }

  const multiplier = distanceUnit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).send({
    status: 'success',
    results: distances.length,
    data: distances
  });
});
