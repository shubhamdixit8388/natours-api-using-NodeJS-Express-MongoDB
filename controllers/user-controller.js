const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');

const filterObject = (object, ...allowedFields) => {
  const newObject = {};
  Object.keys(object).forEach(key => {
    if (allowedFields.includes(key)) newObject[key] = object[key];
  });
  return newObject;
}

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).send({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUserById = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

exports.addNewUser = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
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

exports.updateUser = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

exports.deleteUserById = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};
