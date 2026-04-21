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
  --icon-primary: #702C62;
  --icon-success: #339900;
  --icon-warning: #FF7C00;
  --icon-error: #E54141;
  --icon-disabled: #9E9E9E;
  --icon-on-dark: #FFFFFF;
}

@font-face {
  font-family: "MyIcons";
  src: url("./myicons.woff2") format("woff2");
  font-display: block;
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

/* Size Utilities */
.icon-sm { font-size: 12px !important; }
.icon-lg { font-size: 20px !important; }
.icon-xl { font-size: 24px !important; }

/* Dynamic Theme Utilities (Lean & Mean) */
.clr-primary      { --icon-fill: #702C62; --icon-bg: #DBCAD8; color: var(--icon-fill) !important; }
.clr-action-hover { --icon-fill: #542149; --icon-bg: #EEDEEA; color: var(--icon-fill) !important; }
.clr-success       { --icon-fill: #339900; --icon-bg: #CCE5B3; color: var(--icon-fill) !important; }
.clr-warning       { --icon-fill: #FF7C00; --icon-bg: #FFD9BF; color: var(--icon-fill) !important; }
.clr-error         { --icon-fill: #E54141; --icon-bg: #F8CFCF; color: var(--icon-fill) !important; }
.clr-white         { --icon-fill: #FFFFFF; --icon-bg: #381631; color: var(--icon-fill) !important; }
.clr-muted         { --icon-fill: #8D8D8D; --icon-bg: #E0E0E0; color: #9E9E9E !important; }

/* Interaction State Utilities - Using content-box to prevent 'squeezing' the icon glyph */
.is-hover {
  background: var(--icon-bg, #DBCAD8) !important;
  border-radius: 6px !important;
  padding: 4px !important;
  box-sizing: content-box !important;
  color: var(--icon-fill, #702C62) !important;
  display: inline-flex !important;
}

/* Contrast fix for White theme when no state is applied */
.clr-white:not(.is-hover):not(.is-selected) { background: #381631; border-radius: 4px; padding: 2px; }

.is-selected {
  background: var(--icon-fill, #702C62) !important;
  border-radius: 6px !important;
  padding: 4px !important;
  box-sizing: content-box !important;
  color: #ffffff !important;
  display: inline-flex !important;
}

.is-disabled {
  background: #F5F5F5 !important;
  border-radius: 6px !important;
  padding: 4px !important;
  box-sizing: content-box !important;
  color: #9E9E9E !important;
  display: inline-flex !important;
}
`;

    glyphs.forEach(glyph => {
      let name = glyph.metadata.name;
      let unicode = glyph.metadata.unicode[0].charCodeAt(0).toString(16);
      
      // Sanitization: Numeric icon names (e.g., '100') get 'i-' prefix for CSS validity
      const selector = /^\d/.test(name) ? 'i-' + name : name;
      
      cssContent += `\n.${selector}:before { font-family: "MyIcons" !important; content: "\\${unicode}"; }`;
    });

    fs.writeFileSync(path.join(FONT_DIR, 'icons.css'), cssContent.trim() + '\n');
    console.log('🎭 Web fonts and normalized CSS and generated at dist/font/icons.css');
    
    return glyphs; // Return glyph data for metadata generation
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
