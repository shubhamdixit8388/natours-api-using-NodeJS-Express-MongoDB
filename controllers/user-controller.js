const multer = require('multer');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (req, file, callback) => {
    const extension = file.mimetype.split('/')[1].split('+')[0];
    callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  }
});

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

exports.uploadUserPhoto = upload.single('photo');

const filterObject = (object, ...allowedFields) => {
  const newObject = {};
  Object.keys(object).forEach(key => {
    if (allowedFields.includes(key)) newObject[key] = object[key];
  });
  return newObject;
}

exports.addNewUser = factory.addOne(User);
exports.getUserById = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUserById = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res,next) => {
  console.log(req.file);
  console.log(req.body);
  // 1. create error if user post password related data
  if (req.body.password || req.body.passwordConfirm) {
     return next(new AppError('this route is not for password update', 403))
  }

  // 2. filter out unwanted fields
  const filteredBody = filterObject(req.body, 'name', 'email');

  if (req.file) filteredBody.photo = req.file.filename;

  // 3. update user document
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {new: true, runValidators: true});

  res.status(200).send({
    status: 'success',
    data: {
      user: user
    }
  })
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {isActive: false});

  res.status(204).send({
    status: 'success'
  })
});
