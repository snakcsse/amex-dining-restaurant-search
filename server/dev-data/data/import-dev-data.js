//TODO: change restaurants-simple.json to correct file
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('../../models/restaurantModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// READ FILE
// this script is run separately so use synchronous code
// data should be structured as an array of objects (dictionaries in Python terms), and each obj represents a doc that aligns with the Mongoose schema (Each object's keys should match the fields defined in your Mongoose schema)
const restaurants = JSON.parse(fs.readFileSync('./restaurants-with-google-results.json', 'utf8'));
// const restaurants = JSON.parse(fs.readFileSync('../scraper/data/restaurants.json', 'utf8'));

// IMPORT DATA into DB
const importData = async () => {
  try {
    await Restaurant.create(restaurants); // collection name will automaically become restaurants
    console.log('Data sucessfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // a good practice to exit: ensures that any remaining connections, resources, or background tasks associated with the process are properly cleaned up and released
};

// DELETE all data from collection
const deleteData = async () => {
  try {
    await Restaurant.deleteMany();
    console.log('Data sucessfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);
// RUN node import-dev-data.js --import / --delete in the console to run importData() or deleteData()
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
