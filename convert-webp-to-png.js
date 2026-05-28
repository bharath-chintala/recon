import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directory = path.resolve('public/images/frames2');

async function processDirectory() {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    if (path.extname(file).toLowerCase() === '.webp') {
      const fullPath = path.join(directory, file);
      const outputPath = path.join(
        directory,
        `${path.parse(file).name}.webp`
      );

      console.log(`Converting: ${fullPath} -> ${outputPath}`);

      try {
        await sharp(fullPath)
          .webp()
          .toFile(outputPath);

        fs.unlinkSync(fullPath);
        console.log(`✅ Replaced image with: ${outputPath}`);
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
  }
}

console.log(`Starting conversion in: ${directory}`);

processDirectory()
  .then(() => {
    console.log('\n✅ Conversion complete.');
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
  });
