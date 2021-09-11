const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config({path: `${__dirname}/config.env`});

const app = require('./app');
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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
    required: [true, 'A tour must have a name'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  rating: {
    type: Number,
    default: 4.5
  }
})

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 499
});

testTour.save().then(doc => {
  console.log(doc);
}).catch(error => {
  console.log(error);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});
