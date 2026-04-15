const SVGFixer = require('oslllo-svg-fixer');
const path = require('path');
const fs = require('fs');

const NORMALIZED_DIR = path.join(__dirname, '..', 'tmp-build', 'normalized').replace(/\\/g, '/');
const FIXED_DIR = path.join(__dirname, '..', 'tmp-build', 'fixed').replace(/\\/g, '/');

async function fixStrokes() {
  fs.mkdirSync(FIXED_DIR, { recursive: true });
  
  try {
    await SVGFixer(NORMALIZED_DIR, FIXED_DIR, { showProgressBar: false }).fix();
  } catch (err) {
    console.error('Error outlining strokes:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  fixStrokes();
} else {
  module.exports = fixStrokes;
}
