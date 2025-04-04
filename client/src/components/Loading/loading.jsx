import React, { useState, useEffect } from 'react';
import './loading.css';

function Loading() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Watch for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail) {
        setTheme(event.detail.theme);
      } else {
        setTheme(localStorage.getItem('theme') || 'dark');
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return (
    <div className={`loading-overlay ${theme}`}>
      <div className="predixor-loader">
        <div className="logo-animation">
          <h1 className="logo-text-loader">
            Pred<span className="logo-accent-loader">ixor</span>
          </h1>
        </div>
        <div className="pulse-container">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay1"></div>
          <div className="pulse-ring delay2"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
