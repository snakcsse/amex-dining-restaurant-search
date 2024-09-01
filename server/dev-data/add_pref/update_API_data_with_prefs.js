const fs = require('fs');

// Read data
const api_fetched_data = JSON.parse(
  fs.readFileSync('../data/restaurants-with-google-results.json', 'utf-8')
);
let pref_list = JSON.parse(fs.readFileSync('./pref_list.json', 'utf-8'));
pref_list = pref_list.map((el) => el.Pref);

// Add prefectures to each res
api_fetched_data.map((el) => {
  el.pref = '';
  for (let pref of pref_list) {
    if (el.address.includes(pref)) {
      el.pref = pref;
      return el;
    }
  }
});

// Add city to each res
let city_added_data = [...api_fetched_data];

city_added_data.map((el) => {
  let city = el.address;
  city = city.replace(el.pref, '');

  function findFirstMatchIndex(str, chars) {
    let minIndex = -1;
    // Loop through each character to find the smallest index
    for (let char of chars) {
      const index = str.indexOf(char);
      // Update minIndex if the current index is valid and smaller
      if (index !== -1 && (minIndex === -1 || index < minIndex)) {
        minIndex = index;
      }
    }

    return minIndex; // Return -1 if no character was found
  }

  let index = findFirstMatchIndex(city, ['市', '区', '郡']);
  if (index < 0) {
    el.city = '';
  } else {
    el.city = city.slice(0, index + 1);
  }
});

fs.writeFile('../data/final_restaurants.json', JSON.stringify(city_added_data, null, 2), (err) => {
  (err) => {
    if (err) {
      console.error('Error writing to file', err);
    }
  };
});
