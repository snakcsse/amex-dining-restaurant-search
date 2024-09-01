const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const delay = require('promise-delay');
const path = require('path');

dotenv.config({ path: '../../config.env' });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY_DEV;
const RATE_LIMIT = 5; // number of requests per batch
const DELAY_BETWEEN_BATCHES = 2000; // delay in milliseconds

const restaurantData = JSON.parse(
  fs.readFileSync('../../../scraper/data/processed_restaurants.json', 'utf-8')
);

const getRestaurantsDetails = async (searchText, lat, lng, originalObj) => {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'places.id,places.rating,places.userRatingCount,places.photos',
    includedType: 'Food and Drink',
    locationBias: {
      rectangle: {
        low: {
          latitude: lat,
          longitude: lng,
        },
        high: {
          latitude: lat,
          longitude: lng,
        },
      },
    },
  };

  const data = {
    textQuery: searchText,
  };

  try {
    const response = await axios.post(url, data, { headers }); // {headers} = {headers:headers}; axios.post's 3 arg is an optional config object where headers is passed
    return { ...originalObj, ...response.data.places[0] }; // merge original restaruant data from python scraping with new data from googleAPI
  } catch (err) {
    console.log(err.message, 'Cannot find the restaurant');
    return originalObj;
  }
};

const getFirstPhoto = async (photo_id, heightPx, widthPx, num) => {
  try {
    const url = `https://places.googleapis.com/v1/${photo_id}/media?key=${API_KEY}&maxHeightPx=${heightPx}&maxWidthPx=${widthPx}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pathName = path.join(__dirname, '..', '/img', `photo-${num}.jpg`);
    fs.writeFile(pathName, response.data, (err) => {
      if (err) {
        console.log('Error writing the photo to file ', err.message);
      } else {
        console.log('Photo saved successfully');
      }
    });
    const imageName = `photo-${num}.jpg`;
    return imageName;
  } catch (err) {
    console.log(err.message, 'Error finding the photo');
    return '';
  }
};

const processBatch = async () => {
  let resDetails = [];
  let batch;
  for (let i = 0; i <= restaurantData.length; i += RATE_LIMIT) {
    console.log('processing...');
    batch = restaurantData.slice(i, i + RATE_LIMIT);
    resDetails.push(
      ...(await Promise.all(batch.map((el) => getRestaurantsDetails(el.name, el.lat, el.lng, el))))
    );
    resDetails = await Promise.all(
      resDetails.map(async (el) => {
        return {
          ...el,
          googlePhoto: el.photos
            ? await getFirstPhoto(
                el.photos[0].name,
                el.photos[0].heightPx,
                el.photos[0].widthPx,
                resDetails.indexOf(el)
              )
            : '',
        };
      })
    );
    await delay(DELAY_BETWEEN_BATCHES);
    console.log('Done processing batch ' + i);
  }
  resDetails = resDetails.map((el) => {
    const { photos, id, rating, userRatingCount, ...rest } = el; // here we exclude photos, id and rename rating and userRatingCount // when ...rest is used in a destructuring, rest will be an object that excludes the keys listed in the { }, which are photos, id, rating, userRatingCount
    return {
      ...rest,
      googleRating: rating,
      googleUserRatingCount: userRatingCount,
    };
  });
  return resDetails;
};

// Immediately invoked async function (IIFE) to run the asynchronous function and module.exports the result
let resDetailsResults;

(async () => {
  try {
    resDetailsResults = await processBatch();
    // console.log(resDetailsResults);
    fs.writeFile(
      path.join(__dirname, 'restaurants-with-google-results.json'),
      JSON.stringify(resDetailsResults, null, 2),
      (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('Data saved to restaurants-with-google-results.json');
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
})();
