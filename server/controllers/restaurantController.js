const Restaurant = require('../models/restaurantModel');
// const redisClient = require('../config/redisClient');

exports.getAllRestaurants = async (req, res, next) => {
  try {
    // if (process.env.NODE_ENV === 'production') {
    // const cacheKey = 'all_restaurants';

    // check if data is in redis
    // const cachedRestaurants = await redisClient.get(cacheKey);

    // if (cachedRestaurants) {
    // console.log('Cache hit');
    // return res
    // .status(200)
    // .json({ status: 'success', data: { restaurants: JSON.parse(cachedRestaurants) } });
    // }

    // console.log('Cache miss');
    // }

    const restaurants = await Restaurant.find().select(
      '-address -googleMapPage -discountTimePeriod -discountExcludeDay -closeDay -lunchDiscount -area_original -__v'
    );

    // Store data in cache
    // if (process.env.NODE_ENV === 'production') {
    // await redisClient.setEx(cacheKey, 2592000, JSON.stringify(restaurants));
    // } // cache for 1 hour

    res.status(200).json({
      status: 'success',
      data: {
        restaurants, // here means restaurants: restaurants
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};
