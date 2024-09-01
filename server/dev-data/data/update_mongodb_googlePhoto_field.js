const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('../../models/restaurantModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Perform the update operation
async function updateGooglePhotoExtension() {
  try {
    await Restaurant.updateMany(
      { googlePhoto: /photo-.*\.jpg$/ }, // Filter for documents with 'photo-*.jpg'
      [
        {
          $set: {
            googlePhoto: {
              $concat: [
                { $substr: ['$googlePhoto', 0, { $subtract: [{ $strLenCP: '$googlePhoto' }, 4] }] },
                '.webp',
              ],
            },
          },
        },
      ]
    );
    console.log('Update completed successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.connection.close(); // Close the connection when done
  }
}

updateGooglePhotoExtension();
