const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tour-model');
const User = require('./../../models/user-model');
const Review = require('./../../models/review-model');

dotenv.config({path: `${__dirname}/../../config.env`});

// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
    .then(() => console.log('Database connection succeed!!!'))
    .catch(() => console.log('Database connection Failed!!!'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importDataToDB = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews);
    console.log('Data added successfully');
  } catch (error) {
    console.log('Error data uploading: ', error);
  }
  process.exit();
}

const deleteDataFromDB = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Tour documents successfully');
  } catch (error) {
    console.log('Error tour document deleting: ', error);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importDataToDB();
} else if (process.argv[2] === '--delete') {
  deleteDataFromDB();
}
