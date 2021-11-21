const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide your a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide your a confirm password'],
    validate: {
      // This only work on ave and create model
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same'
    }
  }
});

module.exports = mongoose.model('User', userSchema);
