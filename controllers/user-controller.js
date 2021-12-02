const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');

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
