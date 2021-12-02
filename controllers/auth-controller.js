const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-model');

exports.signup = catchAsync(async(req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  res.status(201).send({
    status: 'success',
    token,
    data: {
      asd: 'asd',
      user: newUser
    }
  });
});
