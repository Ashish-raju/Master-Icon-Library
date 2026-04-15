const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const svgoConfig = require('../svgo.config.js');

const SRC_DIR = path.join(__dirname, '..', 'tmp-build', 'fixed');
const DEST_DIR = path.join(__dirname, '..', 'tmp-build', 'optimized');

function optimizeIcons() {
  if (!fs.existsSync(SRC_DIR)) return;
  fs.mkdirSync(DEST_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR);
  let optimizedCount = 0;

  files.forEach(file => {
    const rawPath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(rawPath, 'utf8');
    
    try {
      const result = optimize(content, { ...svgoConfig, path: rawPath });
      fs.writeFileSync(path.join(DEST_DIR, file), result.data);
      optimizedCount++;
    } catch (e) {
      console.error(`❌ Optimization failed for ${file}:`, e);
      process.exit(1);
    }
  });

  console.log(`✨ Optimized ${optimizedCount} SVGs using SVGO.`);
}

if (require.main === module) {
  optimizeIcons();
} else {
  module.exports = optimizeIcons;
}
