const fs = require('fs');
const path = require('path');

const DIST_META_DIR = path.join(__dirname, '..', 'dist', 'meta');
const DEMO_DIR = path.join(__dirname, '..', 'demo');

function generateDemo() {
  fs.mkdirSync(DEMO_DIR, { recursive: true });
  
  const metaPath = path.join(DIST_META_DIR, 'icons.json');
  if (!fs.existsSync(metaPath)) return;

  const iconsData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Master Icon Library</title>
  <link rel="stylesheet" href="../dist/font/icons.css?v=${Date.now()}">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #702C62;
      --accent-glow: rgba(112, 44, 98, 0.4);
      --glass-bg: rgba(255, 255, 255, 0.65);
      --glass-border: rgba(255, 255, 255, 0.5);
      --text: #0f172a;
      --subtext: #475569;
      --card-bg-override: rgba(255, 255, 255, 0.65);
    }

    /* Professional Inlined Utilities */
    .p-clr-primary   { --p-icon-fill: #702C62 !important; --p-icon-surface: #DBCAD8 !important; color: var(--p-icon-fill) !important; }
    .p-clr-success   { --p-icon-fill: #339900 !important; --p-icon-surface: #CCE5B3 !important; color: var(--p-icon-fill) !important; }
    .p-clr-warning   { --p-icon-fill: #FF7C00 !important; --p-icon-surface: #FFD9BF !important; color: var(--p-icon-fill) !important; }
    .p-clr-error     { --p-icon-fill: #E54141 !important; --p-icon-surface: #F8CFCF !important; color: var(--p-icon-fill) !important; }
    
    /* On Action Implementation */
    .p-clr-on-action { --p-icon-fill: #702C62 !important; --p-icon-surface: #381631 !important; color: #FFFFFF !important; }
    .p-clr-on-action.p-state-hover { color: #FFFFFF !important; }
    
    /* Muted Implementation */
    .p-clr-muted     { --p-icon-fill: #8D8D8D !important; --p-icon-surface: #E0E0E0 !important; color: #9E9E9E !important; }

    .p-state-hover, .p-state-selected, .p-state-disabled {
      border-radius: 4px !important;
      padding: 4px !important;
      margin: 2px !important;
      box-sizing: content-box !important;
      display: inline-flex !important;
    }
    .p-state-hover    { background: var(--p-icon-surface, #702C62) !important; color: var(--p-icon-fill, #702C62) !important; }
    .p-clr-primary.p-state-hover { color: #702C62 !important; } /* Restore primary color for light hover */
    
    .p-state-selected { background: var(--p-icon-fill, #702C62) !important; color: #ffffff !important; }
    .p-state-disabled { background: #E0E0E0 !important; color: #9E9E9E !important; }

    * { box-sizing: border-box; }

    body {
      font-family: 'Outfit', sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      color: var(--text);
      background-color: #fce7f3;
      background-image: 
        radial-gradient(at 10% 10%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(at 90% 10%, rgba(244, 63, 94, 0.15) 0%, transparent 50%),
        radial-gradient(at 50% 50%, rgba(112, 44, 98, 0.1) 0%, transparent 50%),
        radial-gradient(at 10% 90%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
        radial-gradient(at 90% 90%, rgba(16, 185, 129, 0.15) 0%, transparent 50%);
      background-attachment: fixed;
    }

    .wrapper {
      max-width: 1300px;
      margin: 0 auto;
      padding: 60px 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 60px;
    }

    h1 {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 18px;
      color: var(--subtext);
      font-weight: 400;
    }

    .controls-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
      margin-bottom: 60px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .control-row {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .control-group {
      flex: 1;
    }

    .control-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--subtext);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .search-box {
      width: 100%;
      padding: 16px 24px;
      border-radius: 100px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: rgba(255, 255, 255, 0.8);
      color: var(--text);
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    }

    .search-box:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-glow);
      background: #ffffff;
    }

    .chip-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.05);
      color: var(--subtext);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .chip:hover {
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      color: var(--text);
    }

    .chip.active {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
      box-shadow: 0 8px 16px var(--accent-glow);
      transform: translateY(-2px);
    }

    .color-swatch {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 24px;
    }

    .icon-card {
      background: var(--card-bg-override);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 20px;
      padding: 32px 20px;
      text-align: center;
      cursor: pointer;
      border: 1px solid var(--glass-border);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }

    .icon-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
      opacity: 0;
      transition: opacity 0.4s;
    }

    .icon-card:hover {
      transform: translateY(-8px) scale(1.02);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,1);
      border-color: transparent;
    }

    .icon-card:hover::before { opacity: 1; }

    .icon-card .icon-preview {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      position: relative;
      z-index: 1;
    }

    .preview-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .icon-card .icon-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--subtext);
      word-break: break-all;
      position: relative;
      z-index: 1;
      transition: color 0.3s;
    }

    .icon-card:hover .icon-name {
      color: var(--text);
    }

    .toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px) scale(0.95);
      background: #0f172a;
      color: white;
      padding: 16px 32px;
      border-radius: 100px;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
      z-index: 1000;
      font-weight: 500;
      letter-spacing: 0.02em;
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toast::before {
      content: '✨';
    }
    .toast.show { 
      opacity: 1; 
      transform: translateX(-50%) translateY(0) scale(1);
    }
  </style>
</head>
<body>

  <div class="wrapper">
    <div class="header">
      <h1>Master Icon Library</h1>
      <div class="subtitle">A professional utility-class system for modern web interfaces.</div>
    </div>
    
    <div class="controls-panel">
      <div class="control-group">
        <input type="text" id="search" class="search-box" placeholder="Start typing to filter icons...">
      </div>
      
      <div class="control-row">
        <div class="control-group">
          <label>Branding Themes</label>
          <div class="chip-group" id="color-select">
            <button class="chip active" data-class="p-clr-primary" data-hex="#702C62" data-label="Action"><span class="color-swatch" style="background:#702C62;"></span> Action / Info (#702C62)</button>
            <button class="chip" data-class="p-clr-success" data-hex="#339900" data-label="Success"><span class="color-swatch" style="background:#339900;"></span> Success (#339900)</button>
            <button class="chip" data-class="p-clr-warning" data-hex="#FF7C00" data-label="Warning"><span class="color-swatch" style="background:#FF7C00;"></span> Warning (#FF7C00)</button>
            <button class="chip" data-class="p-clr-error" data-hex="#E54141" data-label="Error"><span class="color-swatch" style="background:#E54141;"></span> Error (#E54141)</button>
            <button class="chip" data-class="p-clr-on-action" data-hex="#FFFFFF" data-label="White"><span class="color-swatch" style="background:#FFFFFF;"></span> On Action (#FFFFFF)</button>
            <button class="chip" data-class="p-clr-muted" data-hex="#9E9E9E" data-label="Muted"><span class="color-swatch" style="background:#9E9E9E;"></span> Disabled (#9E9E9E)</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Interaction Geometries</label>
          <div class="chip-group" id="state-select">
            <button class="chip active" data-class="none">No Background</button>
            <button class="chip" data-class="p-state-hover">Hover BG</button>
            <button class="chip" data-class="p-state-selected">Selected BG</button>
            <button class="chip" data-class="p-state-disabled">Disabled BG</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Standard Scales</label>
          <div class="chip-group" id="size-select">
            <button class="chip" data-class="icon-8" data-size="8px">8px</button>
            <button class="chip" data-class="icon-12" data-size="12px">12px</button>
            <button class="chip" data-class="icon-14" data-size="14px">14px</button>
            <button class="chip active" data-class="icon-16" data-size="16px">16px</button>
            <button class="chip" data-class="icon-20" data-size="20px">20px</button>
            <button class="chip" data-class="icon-24" data-size="24px">24px</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Professional Syntax</label>
          <div class="chip-group" id="syntax-select">
            <button class="chip" data-syntax="html">HTML / ClassList</button>
            <button class="chip active" data-syntax="react">React (Prop-based)</button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid" id="grid">
      ${iconsData.map(icon => `
        <div class="icon-card" data-name="${icon.name}">
          <div class="icon-preview">
            <div class="preview-box">
              <span class="icon icon-${icon.name} icon-16 p-clr-primary"></span>
            </div>
          </div>
          <div class="icon-name">${icon.name}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="toast" id="toast">Copied to clipboard!</div>

  <script>
    const search = document.getElementById('search');
    const colorChips = document.querySelectorAll('#color-select .chip');
    const sizeChips = document.querySelectorAll('#size-select .chip');
    const stateChips = document.querySelectorAll('#state-select .chip');
    const syntaxChips = document.querySelectorAll('#syntax-select .chip');
    const cards = document.querySelectorAll('.icon-card');
    const toast = document.getElementById('toast');
    const root = document.documentElement;

    let currentSettings = {
      color: 'p-clr-primary',
      hex: '#702C62',
      size: 'icon-16',
      sizePx: '16px',
      state: 'none',
      syntax: 'react'
    };

    function updatePreviews() {
      cards.forEach(card => {
        const icon = card.querySelector('.icon');
        // Reset dynamic classes
        icon.className = icon.className.replace(/icon-(8|12|14|16|20|24)/g, '').trim();
        icon.className = icon.className.replace(/[up]-clr-(primary|success|warning|error|on-action|muted)/g, '').trim();
        icon.className = icon.className.replace(/[up]-state-(hover|selected|disabled)/g, '').trim();
        
        // Add current settings
        icon.classList.add(currentSettings.size);
        icon.classList.add(currentSettings.color);
        if (currentSettings.state !== 'none') {
          icon.classList.add(currentSettings.state);
        }

        // Handle card background contrast for "On Action" (white) OR Branding "White" (p-clr-on-action)
        if ((currentSettings.color === 'p-clr-on-action' || currentSettings.hex === '#FFFFFF') && currentSettings.state === 'none') {
          root.style.setProperty('--card-bg-override', 'rgba(15, 23, 42, 0.9)');
        } else {
          root.style.setProperty('--card-bg-override', 'rgba(255, 255, 255, 0.65)');
        }
      });
    }

    // Search Filtering
    search.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase();
      cards.forEach(card => {
        const name = card.dataset.name;
        card.style.display = name.includes(val) ? 'block' : 'none';
      });
    });

    // Color Toggling
    colorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        colorChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentSettings.color = chip.dataset.class;
        currentSettings.hex = chip.dataset.hex;
        updatePreviews();
      });
    });

    // Size Toggling
    sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sizeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentSettings.size = chip.dataset.class;
        currentSettings.sizePx = chip.dataset.size;
        updatePreviews();
      });
    });

    // State Toggling (Disabling logic removed as per user request - ALL pills stay enabled)
    stateChips.forEach(chip => {
      chip.addEventListener('click', () => {
        stateChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentSettings.state = chip.dataset.class;
        updatePreviews();
      });
    });

    // Syntax Toggling
    syntaxChips.forEach(chip => {
      chip.addEventListener('click', () => {
        syntaxChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentSettings.syntax = chip.dataset.syntax;
      });
    });

    // Copy logic
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.name;
        let snippet = '';
        
        const classes = ['icon', 'icon-' + name, currentSettings.size];
        classes.push(currentSettings.color);
        if (currentSettings.state !== 'none') {
          classes.push(currentSettings.state);
        }

        const classString = classes.join(' ');

        if (currentSettings.syntax === 'react') {
          snippet = '<span className="' + classString + '"></span>';
        } else {
          snippet = '<span class="' + classString + '"></span>';
        }

        navigator.clipboard.writeText(snippet);
        toast.textContent = 'Optimized ' + currentSettings.syntax.toUpperCase() + ' Copied! (' + currentSettings.sizePx + ' · ' + currentSettings.hex + ')';
        toast.className = 'toast show';
        setTimeout(() => toast.className = 'toast', 2000);
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DEMO_DIR, 'index.html'), html);
  console.log('🎨 Demo page explicitly generated at demo/index.html');
}

if (require.main === module) {
  generateDemo();
} else {
  module.exports = generateDemo;
}
