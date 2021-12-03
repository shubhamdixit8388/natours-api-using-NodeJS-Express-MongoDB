const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-model');
const AppError = require('./../utils/app-error');

// Stateless authentication
const getJWT = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = catchAsync(async(req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = getJWT(newUser._id);
  res.status(201).send({
    status: 'success',
    token,
    data: {
      asd: 'asd',
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password', 400))
  }

  // 2. check if user exist and password is correct
  const user = await User.findOne({email}).select('+password');
  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!(isPasswordCorrect && user)) {
    return next(new AppError('Incorrect email or password', 400));
  }
  // 3. if everything okay then send token to user
  const token = getJWT(user._id);
  res.status(200).send({
    status: 'success',
    token
  })
})

exports.authenticateUser = catchAsync(async (req, res, next) => {
  // Get token and Check if token exist
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Unauthenticated user', 401));
  }
  // Validate token
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decodedToken);

  // Check if user exist
  const user = await User.findById(decodedToken.id);
  if(!user) {
    return next(new AppError('User does not exist with this token', 401))
  }

  // If user changed password after jwt was issued

  next();
});
