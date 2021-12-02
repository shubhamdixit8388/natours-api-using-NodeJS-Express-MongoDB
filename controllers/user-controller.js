const catchAsync = require('../utils/catch-async');
const User = require('../models/user-model');

exports.getAllUsers = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

exports.getUserById = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

exports.addNewUser = catchAsync(async(req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  res.status(201).send({
    status: 'success',
    data: {
      user: newUser
    }
  });
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
