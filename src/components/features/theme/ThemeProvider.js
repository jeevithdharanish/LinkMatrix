'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  resolvedTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // On mount, read persisted preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'light';
    setThemeState(stored);
    setMounted(true);
  }, []);

  // Apply theme class whenever `theme` changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const setTheme = (t) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
