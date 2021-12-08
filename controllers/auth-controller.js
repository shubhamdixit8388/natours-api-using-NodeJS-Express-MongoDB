const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

const createSendToken = (user, statusCode, res) => {
  const token = getJWT(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24  * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  // It deletes password variable from object
  user.password = undefined;
  res.status(statusCode).send({
    status: 'success',
    token,
    data: {
      user: user
    }
  });
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

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password', 400))
  }

  // 2. check if user exist and password is correct
  const user = await User.findOne({email}).select('+password');
  if (!user) {
    return next(new AppError('Email not exist', 400));
  }
  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email or password', 400));
  }
  // 3. if everything okay then send token to user
  createSendToken(user, 200, res);
});

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

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.url);
  // 1. get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresIn: {$gt: Date.now()}
  });
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  // 2. If user is present then reset password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;
  await user.save();

  // 3. update changePasswordAt
  // 4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // 2. check password is correct
  if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Password is wrong', 401))
  }
  // 3. update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // user.findByIdAndUpdate will not check all validators

  // 4. log in user and send jwt
  createSendToken(user, 200, res);
});
