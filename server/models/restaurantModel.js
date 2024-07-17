const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

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
      enum: ['Point'],
      required: true,
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
});

// mongoose.model('Restaurant', restaurantSchema) implicitly sets the collection name to 'restaurants' (mongoose convert it to plural and lowercase)
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
