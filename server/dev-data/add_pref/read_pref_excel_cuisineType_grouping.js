const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filepath1 = path.join('C:', 'Users', 'styip', 'Desktop', 'JP_Pref_list_v1.xlsx');
const filepath2 = path.join('C:', 'Users', 'styip', 'Desktop', 'cuisineType_grouping.xlsx');
const filepath3 = path.join('C:', 'Users', 'styip', 'Desktop', 'Pref_list_with_code.xlsx');

// revive the below if to import pref file or cuisineType
// const fileBuffer = fs.readFileSync(filepath1);
// const fileBuffer = fs.readFileSync(filepath2);
const fileBuffer = fs.readFileSync(filepath3);
const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
// revive the below if to import pref file
// const jsonData = xlsx.utils.sheet_to_json(worksheet);

// revive the below if to import cuisineType
// const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to get an array of arrays
const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to get an array of arrays

// revive the below if to import pref file
// fs.writeFileSync('./pref_list.json', JSON.stringify(jsonData, null, 2), (err) => {
//   if (err) {
//     console.error('Error writing to file', err);
//   }
// });

const data = {};
jsonData.forEach((row) => {
  if ([row[0]] && row[1]) {
    data[row[0]] = row[1];
  }
});

// revive the below if to import cuisineType
// fs.writeFileSync('./cuisineType_grouping.json', JSON.stringify(data, null, 2), (err) => {
//   if (err) {
//     console.error('Error writing to file', err);
//   }
// });

fs.writeFileSync('./pref_with_code.json', JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file', err);
  }
});
