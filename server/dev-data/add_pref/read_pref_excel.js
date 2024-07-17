const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filepath = path.join('C:', 'Users', 'styip', 'Desktop', 'JP_Pref_list_v1.xlsx');

const fileBuffer = fs.readFileSync(filepath);
const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(worksheet);

fs.writeFileSync('./pref_list.json', JSON.stringify(jsonData, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file', err);
  }
});
