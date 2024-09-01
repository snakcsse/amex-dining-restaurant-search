const fs = require('fs');

// Read data
const final_data_to_process = JSON.parse(
  fs.readFileSync('../data/final_restaurants.json', 'utf-8')
);

const cuisineType_grouping = JSON.parse(fs.readFileSync('./cuisineType_grouping.json', 'utf-8'));
const pref_code = JSON.parse(fs.readFileSync('./pref_with_code.json', 'utf-8'));

// Update area
const adjusted_area = final_data_to_process.map((res) => {
  res['area_original'] = res['area'];
  res['area'] = res['pref'] + ' ' + res['area'];
  return res;
});

// Update cuisineType
const adjusted_cuisineType = adjusted_area.map((res) => {
  res['cuisineType_original'] = res['cuisineType'];
  res['cuisineType'] = cuisineType_grouping[res['cuisineType']];
  return res;
});

// Add pref code
const add_pref_code = final_data_to_process.map((res) => {
  res['prefCode'] = pref_code[res['pref']];
  return res;
});

fs.writeFile('../data/final_restaurants.json', JSON.stringify(add_pref_code, null, 2), (err) => {
  (err) => {
    if (err) {
      console.error('Error writing to file', err);
    }
  };
});
