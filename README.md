# ashish-icon-library

A premium, automated icon library designed for modern React applications. Features professional utility classes for sizing, branding, and interaction states.

[🚀 **View Live Searchable Gallery**](https://Ashish-raju.github.io/Master-Icon-Library/demo/)

## 📦 Installation

```bash
npm install ashish-icon-library
```

## 🛠 Usage

### 1. Import the Font Styles
Import the CSS in your application entry file (e.g., `index.js` or `App.js`):

```javascript
import "ashish-icon-library/font";
```

### 2. Use in JSX
Apply the `.icon` base class followed by the icon name:

```jsx
// Standard 16px icon
<span className="icon user"></span>

// Large 20px icon
<span className="icon settings icon-lg"></span>
```

## 📏 Sizing Utilities

| Class | Size |
| :--- | :--- |
| `.icon-sm` | 12px |
| *(default)* | 16px |
| `.icon-lg` | 20px |
| `.icon-xl` | 24px |

## 🎨 Branding & Interaction Utilities

The library includes "lean and mean" utilities for dynamic theming:

### Branding Colors
- `.clr-primary`: Main brand color
- `.clr-success`: Success green
- `.clr-warning`: Warning orange
- `.clr-error`: Error red
- `.clr-white`: Forced white (on dark backgrounds)

### Interaction States
- `.is-hover`: Professional hover background effect
- `.is-selected`: Direct selection state
- `.is-disabled`: Greyscale disabled state

**Example:**
```jsx
<span className="icon activity clr-success is-hover"></span>
```

---

## 👩‍💻 For Maintainers

### 1. Adding New Icons
1. Drop your `.svg` files into the `/icons-svg` folder.
2. Ensure they are optimized (flat fills, no strokes if possible, though the pipeline handles stroke conversion).
3. Run the build command.

### 2. Rebuilding Assets
```bash
npm run build
```

### 3. Publishing to NPM
We use GitHub Actions for automated publishing. Simply create a new **Release** in GitHub, and the `publish.yml` workflow will:
1. Validate all SVGs.
2. Build all production assets into `/dist`.
3. Publish the package to the public NPM registry.
4. Deploy the latest gallery to GitHub Pages.

---

## 📄 License
MIT © Ashish
