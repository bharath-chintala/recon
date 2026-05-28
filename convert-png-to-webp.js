import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const IMAGE_EXTENSIONS = ['.webp', '.webp', '.webp'];
const CODE_FILE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.json', '.html', '.css', '.scss', '.md'
];

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    // Skip node_modules and .git
    if (file === 'node_modules' || file === '.git') continue;

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    }

    // Convert images → WebP
    else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      const outputPath = path.join(
        directory,
        `${path.parse(file).name}.webp`
      );

      console.log(`Converting: ${fullPath} -> ${outputPath}`);

      try {
        await sharp(fullPath)
          .webp({ quality: 80 }) // good compression
          .toFile(outputPath);

        fs.unlinkSync(fullPath);
        console.log(`✅ Replaced image with: ${outputPath}`);
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }

    // Replace image imports in code files
    else if (CODE_FILE_EXTENSIONS.includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, 'utf8');

      const updatedContent = content
        .replace(/\.webp/g, '.webp')
        .replace(/\.webp/g, '.webp')
        .replace(/\.webp/g, '.webp');

      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`Updated imports in: ${fullPath}`);
      }
    }
  }
}

console.log(`Starting conversion in: ${inputDir}`);

processDirectory(inputDir)
  .then(() => {
    console.log('\n✅ Conversion and import replacement complete.');
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
  });