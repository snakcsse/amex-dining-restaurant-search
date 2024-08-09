const fs = require('fs');
const xlsx = require('xlsx');

const data = JSON.parse(fs.readFileSync('../data/final_restaurants.json', 'utf8'));

const areas = [...new Set(data.map((res) => res.area))];
const cuisineTypes = [...new Set(data.map((res) => res.cuisineType))];

// console.log(areas);
console.log(cuisineTypes);
