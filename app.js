const express = require('express');

const userRoutes = require('./routes/user-routes');
const tourRoutes = require('./routes/tour-routes');

const morgan = require('morgan');

// Middlewares
const app = new express();
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('This is middleware');
  next();
});

// Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});
