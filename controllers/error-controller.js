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
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorToProd(error, res);
  }
}
