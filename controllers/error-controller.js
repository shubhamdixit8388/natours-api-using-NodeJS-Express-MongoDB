const AppError = require('../utils/app-error');

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsError = err => {
  const message = `Duplicate field value ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(element => element.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
}

const sendErrorToProd = (err, res) => {
  // Trusted operational errors for client : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message
    })

  // Programming or other unknown error : don't leak error details
  } else {
    // Logging error to console
    console.error('Error: ', err);
    res.status(500).send({
      status: 'error',
      message: 'something went wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.error('Error: ', err);
    let error = JSON.parse(JSON.stringify(err));

    // Error by mongoose
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    //Error by underlying mongoDB driver
    if (error.code === 11000) error = handleDuplicateFieldsError(error);

    if (error._message === 'Validation failed') error = handleValidationError(err)

    sendErrorToProd(error, res);
  }
}
