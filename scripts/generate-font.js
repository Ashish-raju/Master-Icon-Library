const fs = require('fs');
const path = require('path');
const { webfont } = require('webfont');

const OPTIMIZED_DIR = path.join(__dirname, '..', 'tmp-build', 'optimized').replace(/\\/g, '/');
const FONT_DIR = path.join(__dirname, '..', 'dist', 'font');

async function generateFont() {
  fs.mkdirSync(FONT_DIR, { recursive: true });
  
  try {
    const result = await webfont({
      files: `${OPTIMIZED_DIR}/**/*.svg`,
      fontName: 'MyIcons',
      formats: ['woff2'],
      normalize: true,
      fontHeight: 1000,
    });

    const fontPath = path.join(FONT_DIR, 'myicons.woff2');
    fs.writeFileSync(fontPath, result.woff2);

    const glyphs = result.glyphsData;
    let cssContent = `
@font-face {
  font-family: "MyIcons";
  src: url("./myicons.woff2") format("woff2");
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 1;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  text-transform: none;
  vertical-align: middle;
  overflow: hidden;
}

.icon-sm { font-size: 12px; }
.icon-lg { font-size: 20px; }
.icon-xl { font-size: 24px; }
`;

    glyphs.forEach(glyph => {
      const name = glyph.metadata.name;
      let unicode = glyph.metadata.unicode[0].charCodeAt(0).toString(16);
      cssContent += `\n.icon-${name}:before { font-family: "MyIcons" !important; content: "\\${unicode}"; }`;
    });

    fs.writeFileSync(path.join(FONT_DIR, 'icons.css'), cssContent.trim() + '\n');
    console.log(`🎭 Web fonts generated successfully.`);
  } catch (err) {
    console.error('Error generating font with webfont:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  generateFont();
} else {
  module.exports = generateFont;
}
