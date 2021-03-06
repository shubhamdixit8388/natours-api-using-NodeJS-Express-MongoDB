const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: `${__dirname}/config.env`});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception, shutting down');
  process.exit(1);
});

const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
    .then(() => console.log('Database connection succeed!!!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection, shutting down');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Sigterm event received, shutting down server gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
