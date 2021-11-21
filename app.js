const express = require('express');

const userRoutes = require('./routes/user-routes');
const tourRoutes = require('./routes/tour-routes');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');

const morgan = require('morgan');

// Middlewares
const app = new express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
