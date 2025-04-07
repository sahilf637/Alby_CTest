import React from 'react';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="theme-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <span className="toggle-slider"></span>
      </label>
      <span>{darkMode ? '🌙' : '☀️'}</span>
    </div>
  );
};

export default ThemeToggle;
