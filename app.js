const express = require('express');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user-routes');
const tourRoutes = require('./routes/tour-routes');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');

const morgan = require('morgan');

// GLOBAL Middlewares
const app = new express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 2, // Based on application limit
  windowMs: 60 * 60 * 1000, // in milliseconds
  message: 'Too many requests from this IP, please try after an hour'
});

app.use('/api', limiter);

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('This is middleware');
  next();
});

// Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// Handling unknown route
app.all('*', (req, res, next) => {
  // const err = new Error('Requested url not found');
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError('Requested url not found', 404));
})

app.use(globalErrorHandler);

// Start Server
module.exports = app;
