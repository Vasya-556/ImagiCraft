import React, { useState, useEffect } from 'react';

function LightDarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = (e) => {
    setIsDarkMode(e.target.checked);
  };

  return (
    <label className='switch'>
      <input type='checkbox' checked={isDarkMode} onChange={toggleTheme} />
      <span className='slider' />
    </label>
  );
}

export default LightDarkModeToggle;