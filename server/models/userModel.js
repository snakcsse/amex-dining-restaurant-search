const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false, // hide password from the returned documents
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'password confirmation does not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  ],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// hasing password before saving to db
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //TODO: understand why here -1 (refer to course)
  next();
});

// only user accounts which are active can be found
userSchema.pre(/find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//instance method - available for all docs of a collection
// to compare a plain text password(candidatePassword) when hashed with match with the hashed password (userPassword)
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false; //TODO: understand the code
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // can reset pw within 10 mins
  return resetToken; //TODO: understand the code
};

const User = mongoose.model('User', userSchema);

module.exports = User;
