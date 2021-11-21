const catchAsync = require('../utils/catch-async');
const UserModel = require('../models/user-model');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create(req.body);

  res.status(201).send({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
