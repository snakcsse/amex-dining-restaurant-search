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

// ------- Document middleware -------
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
  this.passwordChangedAt = Date.now() - 1000; // sometimes saving to the db is a bit slower than issuing the JWT which makes the user cannot log in using the new token, here we minus 1 second such THAT token is always created after the password has been changed
  next();
});

// ------- Query middleware -------
// Only user accounts which are active can be found
userSchema.pre(/find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ------- Instance method ------
// To check if a plain text password(candidatePassword) when hashed will match with the user's hashed password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // convert to milliseconds
    return JWTTimestamp < changedTimestamp;
  }

  return false; // return false showing JWT is not changed after the token is issued
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // convert it to hexademical string
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // encrypt the password
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // can reset pw within 10 mins
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
