const fs = require('fs');
const path = require('path');

const NAMES_MAP_PATH = path.join(__dirname, '..', 'tmp-build', 'names.json');
const DIST_META_DIR = path.join(__dirname, '..', 'dist', 'meta');

function generateMetadata() {
  fs.mkdirSync(DIST_META_DIR, { recursive: true });

  const namesMap = JSON.parse(fs.readFileSync(NAMES_MAP_PATH, 'utf8'));
  const normalizedNames = Object.keys(namesMap);
  
  const metadataArray = normalizedNames.map(normalized => {
    return {
      name: normalized,
      originalName: namesMap[normalized],
      className: `icon ${normalized}`, // Requested CSS structure
      paths: {
        svg: `dist/svg/${normalized}.svg`,
        sprite: `dist/sprite/sprite.svg#${normalized}`
      }
    };
  });

  fs.writeFileSync(path.join(DIST_META_DIR, 'icons.json'), JSON.stringify(metadataArray, null, 2));
  fs.writeFileSync(path.join(DIST_META_DIR, 'icons-map.json'), JSON.stringify(namesMap, null, 2));

  console.log('📄 Generated metadata JSON files in /dist/meta.');
}

if (require.main === module) {
  generateMetadata();
} else {
  module.exports = generateMetadata;
}
