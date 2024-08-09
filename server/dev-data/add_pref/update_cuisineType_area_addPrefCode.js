const fs = require('fs');

// Reading data
const final_data_to_process = JSON.parse(
  fs.readFileSync('../data/final_restaurants.json', 'utf-8')
);

// const cuisineType_grouping = JSON.parse(fs.readFileSync('./cuisineType_grouping.json', 'utf-8'));
const pref_code = JSON.parse(fs.readFileSync('./pref_with_code.json', 'utf-8'));

// console.log(cuisineType_grouping);

// update area
// const adjusted_area = final_data_to_process.map((res) => {
//   res['area_original'] = res['area'];
//   res['area'] = res['pref'] + ' ' + res['area'];
//   return res;
// });

// update cuisineType
// const adjusted_cuisineType = adjusted_area.map((res) => {
//   res['cuisineType_original'] = res['cuisineType'];
//   res['cuisineType'] = cuisineType_grouping[res['cuisineType']];
//   return res;
// });

// console.log(adjusted_cuisineType.slice(10, 15));

// add pref code
const add_pref_code = final_data_to_process.map((res) => {
  res['prefCode'] = pref_code[res['pref']];
  return res;
});

// console.log(add_pref_code.slice(10, 15));

fs.writeFile('../data/final_restaurants.json', JSON.stringify(add_pref_code, null, 2), (err) => {
  (err) => {
    if (err) {
      console.error('Error writing to file', err);
    }
  };
});
