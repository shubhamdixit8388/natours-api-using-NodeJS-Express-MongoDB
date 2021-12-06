const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-model');
const AppError = require('./../utils/app-error');
const sendEmail = require('./../utils/email');

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
    passwordConfirm: req.body.passwordConfirm,
    role: 'admin'
    // passwordChangedAt: req.body.passwordChangedAt
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
  if (user.checkPasswordChanged(decodedToken.iat)) {
    return next(new AppError('Password recently changed, login again', 401));
  }

  // grant access to protected route
  req.user = user;
  next();
});

exports.checkUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user matching email
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return next(new AppError('User with this email does not exist', 404));
  }

  // 2. generate random token to reset password
  const resetToken = user.getPasswordResetToken();
  // not validating fields while saving to DB. This is not required in my case, still implemented for reference
  await user.save({validateBeforeSave: false});

  // 3. send mail to user having reset token
  const requestUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot your password by clicking on below link: ${requestUrl}`;
  try {
    await sendEmail(user.email, 'Forgot password link', message);
    res.status(200).send({
      status: 'success',
      message: 'Email send successfully'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({validateBeforeSave: false});
    return next(new AppError('There was error while sending email. Please try again', 500));
  }

  res.status(200).send({
    status: 'success'
  })
})
