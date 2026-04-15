const path = require('path');

module.exports = {
  inputDir: './tmp-build/optimized',
  outputDir: './dist/font',
  fontTypes: ['woff2'], // Modern minimum requirement
  assetTypes: ['css'], // Metadata is handled natively in our custom generator
  name: 'MyIcons',
  prefix: 'icon', 
  templates: {
    css: './scripts/templates/css.hbs'
  }
};
