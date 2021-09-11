const mongoose = require('mongoose');

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

module.exports = mongoose.model('Tour', tourSchema);
