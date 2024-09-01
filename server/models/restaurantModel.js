const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true,
    trim: true,
  },
  area: String,
  cuisineType: String,
  resPage: String,
  address: String,
  googleMapPage: String,
  googleRating: { type: Number, default: null },
  googleUserRatingCount: { type: Number, default: null },
  googlePhoto: { type: String, default: null },
  // GEOJSON
  location: {
    type: {
      type: String,
      required: true,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  catchCopy: String,
  access: String,
  discountTimePeriod: String,
  discountExcludeDay: String,
  closeDay: String,
  lunchDiscount: String,
  pref: String,
  city: String,
  area_original: String,
  cuisineType_original: String,
  prefCode: Number,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
