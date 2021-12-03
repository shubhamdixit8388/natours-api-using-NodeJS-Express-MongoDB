const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minlength: 8,
    select: false
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
    },
    select: false
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
  // Only run this functions if password was actually modified
  if(!this.isModified('password')) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
})

// Instance Mehtod
userSchema.methods.checkPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.checkPasswordChanged = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedTimeStamp > jwtTimeStamp;
  }
  return false;
}

module.exports = mongoose.model('User', userSchema);
