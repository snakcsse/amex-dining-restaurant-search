const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = '../img';
const outputDir = '../optimized-img';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach((file) => {
  if (path.extname(file) === '.jpg') {
    sharp(path.join(inputDir, file))
      .resize(1024) // Resize to a max width of 1024px
      .toFormat('webp') // Convert to WebP format
      .webp({ quality: 85 }) // Set quality to 85%
      .toFile(path.join(outputDir, file.replace('.jpg', '.webp')), (err, info) => {
        if (err) console.error(err);
        else console.log(`Optimized: ${file}`);
      });
  }
});
