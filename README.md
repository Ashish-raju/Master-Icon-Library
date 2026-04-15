# Master Icon Library 🚀

> **The Single Source of Truth for Enterprise Iconography.**

The **Master Icon Library** is a high-performance, automated pipeline that transforms raw design assets (SVGs) into a comprehensive suite of production-ready web assets. It eliminates manual handoff friction between design and engineering.

---

## 🏗️ Core Features
- **Automated Normalization:** Strips Figma-specific naming and forces strict `kebab-case`.
- **Geometry Guardrails:** Enforces perfectly square grids and monochromatic paths.
- **Smart Tracing:** Automatically converts SVG strokes into solid paths for zero-error font rendering.
- **Dynamic Styling:** All assets are normalized to `currentColor` for effortless CSS theming.
- **Interactive Demo:** A premium, glassmorphism-based previewer with brand-aware state toggling.

## 📦 Getting Started

### 1. Installation
Clone the repository and install the compiler dependencies:
```bash
git clone <repository-url>
cd MasterIconLibrary
npm install
```

### 2. Add Your Icons
Drop your `.svg` files directly into the `/icons-svg` folder.
*Example: `Property 1=Add_User.svg`*

### 3. Compile the Library
Run the build orchestrator to generate all distribution formats and the demo site:
```bash
npm run icons
```

## 🛠️ Integrated Usage

### Standard Icon Font (CSS)
```html
<link rel="stylesheet" href="dist/font/icons.css">

<!-- Implementation -->
<span class="icon icon-add-user"></span>
```

### SVG Sprite (Modern Web)
```html
<svg class="icon">
  <use href="dist/svg/sprite.svg#add-user"/>
</svg>
```

---

## 📘 Deep Dive Documentation
For a full technical breakdown of the architecture, design system requirements, and CI/CD integration, please refer to the:

👉 [**Technical Documentation (DOCUMENTATION.md)**](./DOCUMENTATION.md)

---

**Built with Precision for Enterprise Teams.**
