import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import iconsData from 'ashish-icon-library/meta';

interface IconMeta {
  name: string;
  className: string;
}

const App = () => {
  // State for all the original demo controls
  const [searchTerm, setSearchTerm] = useState('');
  const [activeColor, setActiveColor] = useState('clr-primary');
  const [activeState, setActiveState] = useState('none');
  const [activeScale, setActiveScale] = useState('none');
  const [activeSyntax, setActiveSyntax] = useState('react');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  // Branding Themes configuration
  const brandingThemes = [
    { id: 'clr-primary', hex: '#702C62', label: 'Action / Info' },
    { id: 'clr-action-hover', hex: '#5D2452', label: 'Action Hover' },
    { id: 'clr-success', hex: '#339900', label: 'Success' },
    { id: 'clr-warning', hex: '#FF7C00', label: 'Warning' },
    { id: 'clr-error', hex: '#E54141', label: 'Error' },
    { id: 'clr-white', hex: '#FFFFFF', label: 'On Action' },
    { id: 'clr-muted', hex: '#9E9E9E', label: 'Disabled' }
  ];

  // Interaction Geometries configuration
  const interactionStates = [
    { id: 'none', label: 'No Background' },
    { id: 'is-hover', label: 'Hover BG' },
    { id: 'is-selected', label: 'Selected BG' },
    { id: 'is-disabled', label: 'Disabled BG' }
  ];

  // Standard Scales configuration
  const scales = [
    { id: 'icon-8', label: '8px' },
    { id: 'icon-10', label: '10px' },
    { id: 'icon-sm', label: 'sm (12px)' },
    { id: 'icon-14', label: '14px' },
    { id: 'none', label: 'default (16px)' },
    { id: 'icon-lg', label: 'lg (20px)' },
    { id: 'icon-xl', label: 'xl (24px)' }
  ];

  // Icons Memo
  const icons = useMemo(() => {
    if (!Array.isArray(iconsData)) return [];
    return iconsData as IconMeta[];
  }, []);

  const filteredIcons = useMemo(() => {
    return icons.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, icons]);

  const handleCopy = (iconSelector: string) => {
    const classList = [
      'icon',
      iconSelector,
      activeColor,
      activeState !== 'none' ? activeState : '',
      activeScale !== 'none' ? activeScale : ''
    ].filter(Boolean).join(' ');

    const copyText = activeSyntax === 'react' 
      ? `<span className="${classList}"></span>` 
      : `<span class="${classList}"></span>`;

    navigator.clipboard.writeText(copyText);
    setToastText(`Copied Tag: ${copyText}`);
    setToastVisible(true);
  };

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  return (
    <div className="demo-wrapper">
      {/* Header */}
      <header className="header-section">
        <h1>Ashish Icon Library</h1>
        <div className="subtitle">Search, preview and consume premium icons for your React applications.</div>
      </header>

      {/* Controls Panel */}
      <div className="controls-panel">
        <div className="control-group">
          <input 
            type="text" 
            placeholder="Start typing to filter icons..." 
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Branding Themes</label>
          <div className="chip-grid">
            {brandingThemes.map(theme => (
              <button 
                key={theme.id}
                className={`chip ${activeColor === theme.id ? 'active' : ''}`}
                onClick={() => setActiveColor(theme.id)}
              >
                <span className="color-swatch" style={{ background: theme.hex }}></span>
                {theme.label} ({theme.hex})
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Interaction Geometries</label>
          <div className="chip-grid">
            {interactionStates.map(state => (
              <button 
                key={state.id}
                className={`chip ${activeState === state.id ? 'active' : ''}`}
                onClick={() => setActiveState(state.id)}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Standard Scales</label>
          <div className="chip-grid">
            {scales.map(scale => (
              <button 
                key={scale.id}
                className={`chip ${activeScale === scale.id ? 'active' : ''}`}
                onClick={() => setActiveScale(scale.id)}
              >
                {scale.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>NPM Consumption Syntax</label>
          <div className="chip-grid">
            <button 
              className={`chip ${activeSyntax === 'react' ? 'active' : ''}`}
              onClick={() => setActiveSyntax('react')}
            >
              React (className)
            </button>
            <button 
              className={`chip ${activeSyntax === 'html' ? 'active' : ''}`}
              onClick={() => setActiveSyntax('html')}
            >
              HTML (class)
            </button>
          </div>
        </div>
      </div>

      {/* Icon Grid */}
      <div className="icon-grid">
        <AnimatePresence mode="popLayout">
          {filteredIcons.map((icon) => {
            const selector = icon.className.split(' ').pop() || icon.name;
            const cleanName = icon.name.replace(/[^a-zA-Z0-9]+/g, ' '); 
            
            const fullClasses = [
              'icon',
              selector,
              activeColor,
              activeState !== 'none' ? activeState : '',
              activeScale !== 'none' ? activeScale : ''
            ].filter(Boolean).join(' ');

            return (
              <motion.div
                key={icon.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="icon-card"
                onClick={() => handleCopy(selector)}
              >
                <div className="icon-preview">
                  <span className={fullClasses}></span>
                </div>
                <div className="icon-name">{icon.name}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Copy Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <span>✨</span> {toastText}
      </div>
    </div>
  );
};

export default App;
