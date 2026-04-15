const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'tmp-build', 'optimized');
const RAW_SVG_DIR = path.join(__dirname, '..', 'dist', 'svg');
const SPRITE_DIR = path.join(__dirname, '..', 'dist', 'sprite');

function generateAssets() {
  fs.mkdirSync(RAW_SVG_DIR, { recursive: true });
  fs.mkdirSync(SPRITE_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR);
  let spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n<defs>\n`;

  files.forEach(file => {
    const rawPath = path.join(SRC_DIR, file);
    const destPath = path.join(RAW_SVG_DIR, file);
    
    // Copy for raw SVG output
    fs.copyFileSync(rawPath, destPath);

    // Build the central sprite.svg payload
    const content = fs.readFileSync(rawPath, 'utf8');
    const name = path.basename(file, '.svg');
    
    // Replace <svg> with <symbol id="name">
    const symbol = content
      .replace(/<svg([^>]+)>/, `<symbol id="${name}"$1>`)
      .replace(/<\/svg>/, '</symbol>\n');
    
    // Strip nested namespace declarations internally as they're not needed in <symbol>
    const cleanSymbol = symbol.replace(/\sxmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    spriteContent += cleanSymbol;
  });

  spriteContent += `</defs>\n</svg>`;
  fs.writeFileSync(path.join(SPRITE_DIR, 'sprite.svg'), spriteContent);

  console.log(`📦 Exported raw SVGs and created compiled sprite.svg.`);
}

if (require.main === module) {
  generateAssets();
} else {
  module.exports = generateAssets;
}
