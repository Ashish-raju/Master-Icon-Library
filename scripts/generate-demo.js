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
  <link rel="stylesheet" href="../dist/font/icons.css">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #702C62;
      --accent-glow: rgba(112, 44, 98, 0.4);
      --glass-bg: rgba(255, 255, 255, 0.65);
      --glass-border: rgba(255, 255, 255, 0.5);
      --text: #0f172a;
      --subtext: #475569;
      
      /* Dynamic Settings */
      --dynamic-color: #702C62;
      --dynamic-size: 16px;
      --card-bg-override: rgba(255, 255, 255, 0.65);
      
      /* State Styles */
      --state-bg: transparent;
      --state-border: transparent;
      --state-icon-color: var(--dynamic-color);
    }

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
      border-radius: 2px;
      background: var(--state-bg);
      border: 2px solid var(--state-border);
      padding: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .icon-card .icon-preview .icon {
      color: var(--state-icon-color);
      font-size: var(--dynamic-size);
      width: 1em;
      height: 1em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    /* State Logic */
    [data-active-state="none"] {
      --state-bg: transparent;
      --state-border: transparent;
      --state-icon-color: var(--dynamic-color);
    }
    [data-active-state="hover"] {
      --state-bg: #DBCAD8;
      --state-border: transparent;
      --state-icon-color: #702C62;
    }
    [data-active-state="selected"] {
      --state-bg: #702C62;
      --state-border: transparent;
      --state-icon-color: #FFFFFF;
    }
    [data-active-state="disabled"] {
      --state-bg: #D3D3D3;
      --state-border: transparent;
      --state-icon-color: #757575;
    }

    .chip-group.disabled {
      opacity: 0.5;
      pointer-events: none;
      filter: grayscale(1);
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
      <div class="subtitle">Select states to interactively preview geometries and copy exact implementation codes.</div>
    </div>
    
    <div class="controls-panel">
      <div class="control-group">
        <input type="text" id="search" class="search-box" placeholder="Start typing to filter icons...">
      </div>
      
      <div class="control-row">
        <div class="control-group">
          <label>Color State Mappings</label>
          <div class="chip-group" id="color-select">
            <button class="chip active" data-color="#702C62"><span class="color-swatch" style="background:#702C62;"></span> Action / Info (#702C62)</button>
            <button class="chip" data-color="#542149"><span class="color-swatch" style="background:#542149;"></span> Action Hover (#542149)</button>
            <button class="chip" data-color="#212121"><span class="color-swatch" style="background:#212121;"></span> Dark / Text (#212121)</button>
            <button class="chip" data-color="#9E9E9E"><span class="color-swatch" style="background:#9E9E9E;"></span> Disabled (#9E9E9E)</button>
            <button class="chip" data-color="#757575"><span class="color-swatch" style="background:#757575;"></span> On Disabled (#757575)</button>
            <button class="chip" data-color="#339900"><span class="color-swatch" style="background:#339900;"></span> Success (#339900)</button>
            <button class="chip" data-color="#FF7C00"><span class="color-swatch" style="background:#FF7C00;"></span> Warning (#FF7C00)</button>
            <button class="chip" data-color="#E54141"><span class="color-swatch" style="background:#E54141;"></span> Error (#E54141)</button>
            <button class="chip" data-color="#FFFFFF"><span class="color-swatch" style="background:#FFFFFF;"></span> On Action (#FFFFFF)</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Interaction States Preview</label>
          <div class="chip-group" id="state-select">
            <button class="chip active" data-state="none">No Background</button>
            <button class="chip" data-state="hover">Hover BG</button>
            <button class="chip" data-state="selected">Selected BG</button>
            <button class="chip" data-state="disabled">Disabled BG</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Geometric Scale / Font Size</label>
          <div class="chip-group" id="size-select">
            <button class="chip" data-size="8px">8px</button>
            <button class="chip" data-size="12px">12px</button>
            <button class="chip" data-size="14px">14px</button>
            <button class="chip active" data-size="16px">16px</button>
            <button class="chip" data-size="20px">20px</button>
            <button class="chip" data-size="24px">24px</button>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label>Implementation Syntax</label>
          <div class="chip-group" id="syntax-select">
            <button class="chip" data-syntax="html">HTML / Standard</button>
            <button class="chip active" data-syntax="react">React (className)</button>
            <button class="chip" data-syntax="angular">Angular / Vue</button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid" id="grid">
      ${iconsData.map(icon => `
        <div class="icon-card" data-name="${icon.name}">
          <div class="icon-preview">
            <div class="preview-box">
              <span class="icon icon-${icon.name}"></span>
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
    const colorGroup = document.getElementById('color-select');
    const sizeChips = document.querySelectorAll('#size-select .chip');
    const stateChips = document.querySelectorAll('#state-select .chip');
    const syntaxChips = document.querySelectorAll('#syntax-select .chip');
    const cards = document.querySelectorAll('.icon-card');
    const toast = document.getElementById('toast');
    const root = document.documentElement;

    let currentSyntax = 'react';
    root.setAttribute('data-active-state', 'none');

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
        const color = chip.dataset.color;
        root.style.setProperty('--dynamic-color', color);
        
        // If color is white or very light, provide dark contrast background
        if (color.toLowerCase() === '#ffffff') {
          root.style.setProperty('--card-bg-override', 'rgba(15, 23, 42, 0.9)');
        } else {
          root.style.setProperty('--card-bg-override', 'rgba(255, 255, 255, 0.65)');
        }
      });
    });

    // Size Toggling
    sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sizeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        root.style.setProperty('--dynamic-size', chip.dataset.size);
      });
    });

    // State Toggling
    stateChips.forEach(chip => {
      chip.addEventListener('click', () => {
        stateChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const state = chip.dataset.state;
        root.setAttribute('data-active-state', state);

        // Disable colors if state is not 'none'
        if (state !== 'none') {
          colorGroup.classList.add('disabled');
        } else {
          colorGroup.classList.remove('disabled');
        }
      });
    });

    // Syntax Toggling
    syntaxChips.forEach(chip => {
      chip.addEventListener('click', () => {
        syntaxChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentSyntax = chip.dataset.syntax;
      });
    });

    // Copy to clipboard
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.name;
        let code = '';
        
        if (currentSyntax === 'react') {
          code = '\\x3Cspan className="icon icon-' + name + '"\\x3E\\x3C/span\\x3E';
        } else {
          code = '\\x3Cspan class="icon icon-' + name + '"\\x3E\\x3C/span\\x3E';
        }

        navigator.clipboard.writeText(code);
        toast.textContent = 'Copied for ' + currentSyntax.toUpperCase() + ': ' + code;
        toast.className = 'toast show';
        setTimeout(() => toast.className = 'toast', 2000);
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DEMO_DIR, 'index.html'), html);
  console.log(`🎨 Demo page explicitly generated at demo/index.html`);
}

if (require.main === module) {
  generateDemo();
} else {
  module.exports = generateDemo;
}
