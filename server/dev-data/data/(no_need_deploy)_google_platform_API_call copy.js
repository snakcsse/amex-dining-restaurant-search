const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const delay = require('promise-delay');
const path = require('path');

dotenv.config({ path: '../../config.env' });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY_DEV;
const RATE_LIMIT = 5; // number of requests per batch
const DELAY_BETWEEN_BATCHES = 2000; //delay in milliseconds

const restaurantData = [
  // {
  //   name: '北海道の味と心を紡ぐ 和田',
  //   area: '札幌',
  //   cusineType: '日本料理',
  //   resPage: 'https://syotaibiyori.com/restaurant/jp_ja/detail/290',
  //   address: '北海道札幌市中央区北1条西27-1-7',
  //   googleMapPage: 'https://maps.google.com/maps?q=43.056798000000,141.316402000000',
  //   catchCopy: '奥尻島出身の料理人が手がける日本料理',
  //   access: '地下鉄「円山公園」駅1番出口から徒歩2分',
  //   discountTimePeriod: '11:30／12:00※2部制となります',
  //   discountExcludeDay: 'クリスマス期間、年末年始',
  //   closeDay: '水曜、木曜のランチタイム',
  //   lunchDiscount: '可',
  //   location: {
  //     type: 'Point',
  //     coordinates: [43.056798, 141.316402],
  //   },
  //   index: 30,
  // },
  // {
  //   name: '富士甲羅本店八宏園',
  //   area: '静岡',
  //   cusineType: 'かに・日本料理',
  //   resPage: 'https://syotaibiyori.com/restaurant/jp_ja/detail/1026',
  //   address: '静岡県富士市青葉町530',
  //   googleMapPage: 'https://maps.google.com/maps?q=35.163669000000,138.661580000000',
  //   catchCopy: '「かに料理」の美味を存分に',
  //   access: 'JR「富士」駅からひまわりバス「エスポット富士店」下車徒歩3分',
  //   discountTimePeriod:
  //     '11:00～14:30（L.O.）／17:00～20:00（L.O.）\n※土・日・祝日のみ11:00（L.O.）／13:00～15:00（L.O.）／17:00、19:00（L.O.）※ディナータイムは2部制です。入店時間は17:00、19:00からお選びください',
  //   discountExcludeDay: 'GW、お盆、年末年始',
  //   closeDay: 'なし',
  //   lunchDiscount: '可',
  //   location: {
  //     type: 'Point',
  //     coordinates: [35.163669, 138.66158],
  //   },
  //   index: 179,
  // },
  {
    name: '廣東飯店（カントンハンテン）',
    area: '横浜中華街',
    cusineType: '中国料理',
    resPage: 'https://syotaibiyori.com/restaurant/jp_ja/detail/133',
    address: '神奈川県横浜市中区山下町144',
    googleMapPage: 'https://maps.google.com/maps?q=35.443013060000,139.644694410000',
    catchCopy: '海外からもリピーターが訪れる本格中国料理店',
    access:
      'JR「石川町」駅徒歩5分、JR「関内」駅から徒歩10分、地下鉄「関内」駅から徒歩10分、みなとみらい線「元町中華街」駅から徒歩7分',
    discountTimePeriod: '11:00～15:00（L.O.13:30）／17:00～21:30（L.O.19:30）',
    discountExcludeDay: '2024年5月～7月、土・日・祝日のディナータイム、貸切時',
    closeDay: 'なし',
    lunchDiscount: '可',
    location: {
      type: 'Point',
      coordinates: [35.44301306, 139.64469441],
    },
    index: 11,
  },
];

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
    const response = await axios.post(url, data, { headers }); // {headers} means {headers:headers}; axios.post accepts 3 args: url, data, an optional config object, for the config.obj, which contains various configuration options, one of which is headers
    return { ...originalObj, ...response.data.places[0] }; //using spread operator to merge original restaruant data from python scraping with new data from googleAPI
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
    // const blob = new Blob([response.data], { type: 'image/jpeg' });
    // const imageUrl = URL.createObjectURL(blob);
    // return imageUrl;
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
                el.index
              )
            : '',
        };
      })
    );
    await delay(DELAY_BETWEEN_BATCHES);
    console.log('Done processing batch ' + i);
  }
  resDetails = resDetails.map((el) => {
    const { photos, id, rating, userRatingCount, ...rest } = el; // just remeber this syntax: when ...rest is used in a destructuring, rest will be an object that excludes the keys listed in the { }, which are photos, id, rating, userRatingCount // here we exclude photos, id and rename rating and userRatingCount
    // return rest;
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
    console.log(resDetailsResults);
    // fs.writeFile(
    //   path.join(__dirname, 'restaurants-with-google-results.json'),
    //   JSON.stringify(resDetailsResults, null, 2), // 2nd params: specifies an array of properties to include in the JSON string or a function that alters the serialization process, null means to include all properties // 3rd param: number of spaces to use for indentation when formatting the JSON string
    //   (err) => {
    //     if (err) {
    //       console.error('Error writing to file', err);
    //     } else {
    //       console.log('Data saved to restaurants-with-google-results.json');
    //     }
    //   }
    // );
  } catch (err) {
    console.error(err);
  }
})();
