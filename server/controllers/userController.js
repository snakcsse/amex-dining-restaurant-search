const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'name', 'email');

  // Using findByIdAndUpdate here. We don't use .save() here coz here it is not related to password. Also, password is a required field to fill in when we use .save(), otherwise error will be resulted.
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true, // only updated fields will be validated
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.addFavourite = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { favourites: req.body.restaurantId }, // ensure restaurantId is only added if it doesn't already exists in the favourites field
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: 'success', data: { favourites: user.favourites } });
});

exports.removeFavourite = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { favourites: req.body.restaurantId } }, // pull only when there is a match
    { new: true, select: 'favourites' }
  );
  res.status(200).json({ status: 'success', data: { favourites: user.favourites } });
});

exports.getFavourites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favourites');

  res.status(200).json({ status: 'success', data: { favourites: user.favourites } });
});
