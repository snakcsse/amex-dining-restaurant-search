const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      status: 'success',
      data: {
        restaurants,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
  //   TODO: replace the above try catch block with catchAsync function (file to be created)
};
