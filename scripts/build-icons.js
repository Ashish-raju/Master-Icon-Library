const { execSync } = require('child_process');
const path = require('path');

async function main() {
  console.log('🚀 Starting Icon Build Pipeline...\n');

  try {
    // 1. Clean
    require('./clean.js');
    console.log('');

    // 2. Validate & Normalize
    console.log('1️⃣ Validating SVGs...');
    require('./validate-icons.js')();
    console.log('');

    // 2.5 Fix Strokes
    console.log('2️⃣ Converting Strokes to Fills...');
    await require('./fix-strokes.js')();
    console.log('');

    // 3. Optimize
    console.log('3️⃣ Optimizing with SVGO...');
    require('./optimize-icons.js')();
    console.log('');

    // 4. Generate Font
    console.log('4️⃣ Generating Fonts...');
    const glyphs = await require('./generate-font.js')();
    console.log('');

    // 5. Generate Raw SVGs and Sprite
    console.log('5️⃣ Exporting SVG Assets...');
    require('./generate-assets.js')();
    console.log('');

    // 6. Generate Metadata
    console.log('6️⃣ Generating Metadata...');
    require('./generate-metadata.js')(glyphs);
    console.log('');

    // 7. Generate Demo
    console.log('7️⃣ Building Demo Page...');
    require('./generate-demo.js')();
    console.log('');

    console.log('✅ Pipeline Complete! Check the /dist and /demo folders.');
  } catch (error) {
    console.error('\n❌ BUILD FAILED:');
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
