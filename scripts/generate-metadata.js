const fs = require('fs');
const path = require('path');

const NAMES_MAP_PATH = path.join(__dirname, '..', 'tmp-build', 'names.json');
const DIST_META_DIR = path.join(__dirname, '..', 'dist', 'meta');

function generateMetadata(glyphs) {
  fs.mkdirSync(DIST_META_DIR, { recursive: true });

  const namesMapPath = path.join(__dirname, '..', 'tmp-build', 'names.json');
  const namesMap = fs.existsSync(namesMapPath) ? JSON.parse(fs.readFileSync(namesMapPath, 'utf8')) : {};
  
  const metadataArray = glyphs.map(glyph => {
    const name = glyph.metadata.name;
    const selector = /^\d/.test(name) ? 'i-' + name : name;
    
    return {
      name: name,
      originalName: namesMap[name] || `${name}.svg`,
      className: `icon ${selector}`,
      paths: {
        svg: `dist/svg/${name}.svg`,
        sprite: `dist/sprite/sprite.svg#${name}`
      }
    };
  });

  fs.writeFileSync(path.join(DIST_META_DIR, 'icons.json'), JSON.stringify(metadataArray, null, 2));
  console.log(`📄 Generated metadata for ${metadataArray.length} icons in /dist/meta.`);
}

if (require.main === module) {
  generateMetadata();
} else {
  module.exports = generateMetadata;
}
