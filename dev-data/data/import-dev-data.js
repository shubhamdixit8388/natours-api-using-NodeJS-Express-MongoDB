const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tour-model')

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importDataToDB = async () => {
  try {
    await Tour.create(tours);
    console.log('Data added successfully');
  } catch (error) {
    console.log('Error data uploading: ', error);
  }
  process.exit();
}

const deleteDataFromDB = async () => {
  try {
    await Tour.deleteMany();
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
