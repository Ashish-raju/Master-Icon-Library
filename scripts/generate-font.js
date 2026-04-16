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
:root {
  --icon-action: #702C62;
  --icon-success: #339900;
  --icon-warning: #FF7C00;
  --icon-error: #E54141;
  --icon-disabled: #9E9E9E;
  --icon-on-action: #FFFFFF;
}

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

`;

    glyphs.forEach(glyph => {
      const name = glyph.metadata.name;
      let unicode = glyph.metadata.unicode[0].charCodeAt(0).toString(16);
      cssContent += `\n.icon-${name}:before { font-family: "MyIcons" !important; content: "\\${unicode}"; }`;
    });

    // Append Professional Utility Classes at the bottom for maximum specificity
    cssContent += `
/* Professional Scales */
.icon-8  { font-size: 8px !important; }
.icon-12 { font-size: 12px !important; }
.icon-14 { font-size: 14px !important; }
.icon-16 { font-size: 16px !important; }
.icon-20 { font-size: 20px !important; }
.icon-24 { font-size: 24px !important; }

/* Color Utilities: Map both Brand and Surface colors */
/* Action: Using the specific Hover Surface color #DBCAD8 as requested */
.p-clr-primary { --p-icon-fill: #702C62; --p-icon-surface: #DBCAD8; color: var(--p-icon-fill) !important; }

.p-clr-success { --p-icon-fill: #339900; --p-icon-surface: #CCE5B3; color: var(--p-icon-fill) !important; }
.p-clr-warning { --p-icon-fill: #FF7C00; --p-icon-surface: #FFD9BF; color: var(--p-icon-fill) !important; }
.p-clr-error   { --p-icon-fill: #E54141; --p-icon-surface: #F8CFCF; color: var(--p-icon-fill) !important; }

/* On Action: Always White icon, specific BG colors as requested */
.p-clr-on-action { --p-icon-fill: #702C62; --p-icon-surface: #381631; color: #FFFFFF !important; }

/* Muted: Gray icon, Gray Surface, Intermediate Selected BG */
.p-clr-muted { --p-icon-fill: #8D8D8D; --p-icon-surface: #E0E0E0; color: #9E9E9E !important; }

/* State Utilities */
.p-state-hover {
  background: var(--p-icon-surface, #702C62) !important;
  border-radius: 4px !important;
  padding: 4px !important;
  margin: 2px !important;
  box-sizing: content-box !important;
  color: var(--p-icon-fill, #702C62) !important;
  display: inline-flex !important;
}

/* Color Overrides for States: Ensure legibility on Action surface hover */
.p-clr-on-action.p-state-hover { color: #ffffff !important; }

.p-state-selected {
  background: var(--p-icon-fill, #702C62) !important;
  border-radius: 4px !important;
  padding: 4px !important;
  margin: 2px !important;
  box-sizing: content-box !important;
  color: #ffffff !important;
  display: inline-flex !important;
}

.p-state-disabled {
  background: #E0E0E0 !important;
  border-radius: 4px !important;
  padding: 4px !important;
  margin: 2px !important;
  box-sizing: content-box !important;
  color: #9E9E9E !important;
  display: inline-flex !important;
}
`;

    fs.writeFileSync(path.join(FONT_DIR, 'icons.css'), cssContent.trim() + '\n');
    console.log('🎭 Web fonts generated successfully.');
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
