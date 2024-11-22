import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#ffffff',
    foreground: '#000000',
    primary: '#1890ff',
    secondary: '#52c41a',
    danger: '#ff4d4f',
    warning: '#faad14',
    border: '#f0f0f0',
    card: '#ffffff',
    headerBg: '#ffffff',
    sidebarBg: '#ffffff',
  },
  dark: {
    name: 'dark',
    background: '#141414',
    foreground: '#ffffff',
    primary: '#177ddc',
    secondary: '#49aa19',
    danger: '#dc4446',
    warning: '#d89614',
    border: '#303030',
    card: '#1f1f1f',
    headerBg: '#1f1f1f',
    sidebarBg: '#1f1f1f',
  },
  ocean: {
    name: 'ocean',
    background: '#f0f8ff',
    foreground: '#1a365d',
    primary: '#2b6cb0',
    secondary: '#38b2ac',
    danger: '#e53e3e',
    warning: '#dd6b20',
    border: '#bee3f8',
    card: '#ebf8ff',
    headerBg: '#2b6cb0',
    sidebarBg: '#ebf8ff',
  },
  forest: {
    name: 'forest',
    background: '#f0fff4',
    foreground: '#1a4731',
    primary: '#2f855a',
    secondary: '#38a169',
    danger: '#e53e3e',
    warning: '#dd6b20',
    border: '#c6f6d5',
    card: '#f0fff4',
    headerBg: '#2f855a',
    sidebarBg: '#f0fff4',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? themes[savedTheme] : themes.light;
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme.name);
    // Apply theme to body
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.foreground;
  }, [currentTheme]);

  const toggleTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
