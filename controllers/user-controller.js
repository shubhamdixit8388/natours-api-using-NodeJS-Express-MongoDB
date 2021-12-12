const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

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
  // 1. create error if user post password related data
  if (req.body.password || req.body.passwordConfirm) {
     return next(new AppError('this route is not for password update', 403))
  }

  // 2. filter out unwanted fields
  const filteredBody = filterObject(req.body, 'name', 'email');
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
