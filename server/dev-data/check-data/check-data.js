const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// const data = JSON.parse(fs.readFileSync('../data/restaurants-with-google-results.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('../data/final_restaurants.json', 'utf8'));

// Check data without photo
const res_without_photo = data.filter((res) => res.googlePhoto === '');
const res_without_photo_index = [];
data.forEach((res) => {
  if (res.googlePhoto === '') {
    res_without_photo_index.push(data.indexOf(res));
  }
});

console.log(res_without_photo_index);
console.log(res_without_photo_index.length);

const res_without_rating = data.filter((res) => res.googleRating === '' || !res.googleRating);
const res_without_rating_count = data.filter(
  (res) => res.googleUserRatingCount === '' || !res.googleRating
);

console.log(res_without_rating);
console.log(res_without_rating_count);

// Check any corrupt image file
const directoryPath = '../img';
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  // Filter out only .png files
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // Try to open the PNG file with Sharp
    sharp(filePath)
      .metadata()
      .then((info) => {
        return 0;
      })
      .catch((error) => {
        console.error(`File ${file} is corrupt or not a valid PNG: ${error.message}`);
      });
  });
});

// Spot check google rating, rating count, photo
console.log(data.length); // 284 records

let i = 0;
data.forEach((res) => {
  Object.entries(res).forEach(([key, value]) => {
    if (!value || value === '') {
      console.log(res);
      i++;
    }
  });
});

console.log(i); // The 2 restaurants without googleMapPage. The one named 'NonTitle/NARITAYUTAKA is the name shown in the official page so adjustment is not needed
