const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'icons-svg');
const TMP_DIR = path.join(__dirname, '..', 'tmp-build', 'normalized');

function normalizeName(filename) {
  let name = path.basename(filename, '.svg');
  // Remove bad prefixes
  name = name.replace(/^(icon-|property\s*1[\s=_-]*)/i, '');
  
  // To kebab-case (handle CamelCase, spaces, underscores, and special characters like figma brackets or equals)
  name = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-') // Replace all non-alphanumerics with dash
    .replace(/-+/g, '-')            // Collapse multiple dashes
    .replace(/^-+|-+$/g, '')        // Remove leading or trailing dashes
    .toLowerCase();
  return name;
}

function validateAndNormalize() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
    console.error(`Please add some SVGs to ${ICONS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ICONS_DIR).filter(file => file.endsWith('.svg'));
  
  if (files.length === 0) {
    console.error(`No SVGs found in ${ICONS_DIR}.`);
    process.exit(1);
  }

  const nameMap = new Map();
  let hasErrors = false;

  fs.mkdirSync(TMP_DIR, { recursive: true });

  files.forEach(file => {
    const rawPath = path.join(ICONS_DIR, file);
    const content = fs.readFileSync(rawPath, 'utf8');

    // Base Validations
    const stats = fs.statSync(rawPath);
    if (stats.size > 15 * 1024) {
      console.error(`❌ File too large: ${file} (${Math.round(stats.size/1024)}KB). Maximum allowed is 15KB. Please simplify the vector.`);
      hasErrors = true;
      return;
    }

    if (!content.includes('<svg')) {
      console.error(`❌ Invalid SVG file: ${file} (missing <svg> root)`);
      hasErrors = true;
      return;
    }

    if (content.match(/<(linearGradient|radialGradient)/)) {
      console.error(`❌ Unsupported feature in ${file}: Gradients. Fonts require solid monochromatic shapes.`);
      hasErrors = true;
      return;
    }

    // Grid Dimensions
    const viewBoxMatch = content.match(/viewBox="0 0 ([\d\.]+) ([\d\.]+)"/);
    if (viewBoxMatch) {
      const w = parseFloat(viewBoxMatch[1]);
      const h = parseFloat(viewBoxMatch[2]);
      if (w !== h) {
        console.error(`❌ Non-square dimensions in ${file}: ${w}x${h}. Icons must be designed on a uniform square canvas.`);
        hasErrors = true;
        return;
      }
    }

    const normalizedName = normalizeName(file);

    let normalizedContent = content;
    if (!normalizedContent.includes('xmlns=')) {
      normalizedContent = normalizedContent.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    }

    // Duplicate string collision detection
    if (nameMap.has(normalizedName)) {
      console.error(`❌ DUPLICATE DETECTED!
Both "${nameMap.get(normalizedName)}" and "${file}" collapse to the same normalized name: "${normalizedName}"`);
      hasErrors = true;
    } else {
      nameMap.set(normalizedName, file);
      const destPath = path.join(TMP_DIR, `${normalizedName}.svg`);
      fs.writeFileSync(destPath, normalizedContent);
    }
  });

  if (hasErrors) {
    console.error('\\nValidation failed due to structural or naming conflicts.');
    process.exit(1);
  }

  console.log(`✅ Validated and normalized ${files.length} SVGs to kebab-case.`);
  
  // Write the mapping for metadata later
  const tmpRoot = path.join(__dirname, '..', 'tmp-build');
  if (!fs.existsSync(tmpRoot)) fs.mkdirSync(tmpRoot);
  fs.writeFileSync(path.join(tmpRoot, 'names.json'), JSON.stringify(Object.fromEntries(nameMap), null, 2));

  return true;
}

if (require.main === module) {
  validateAndNormalize();
} else {
  module.exports = validateAndNormalize;
}
