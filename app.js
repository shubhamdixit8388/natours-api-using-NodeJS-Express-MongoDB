const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userRoutes = require('./routes/user-routes');
const tourRoutes = require('./routes/tour-routes');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');

const morgan = require('morgan');

// GLOBAL Middlewares
const app = new express();

// helmet headers. Helmet is a collection of 14 middleware which adds different header options for security reason
app.use(helmet());

// Body parse, reading data from body to req.body. Here we set maximum of 10 KB of data in each request body
app.use(express.json({limit: '10kb'}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit request for API from same IP address
const limiter = rateLimit({
  max: 2, // Based on application limit
  windowMs: 60 * 60 * 1000, // in milliseconds
  message: 'Too many requests from this IP, please try after an hour'
});
app.use('/api', limiter);

// Serving static files
app.use(express.static(`${__dirname}/public`))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
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
