'use client';

import { useTheme } from '@/components/features/theme/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme } = useTheme();

  // Helper to get active icon
  const getIcon = () => {
    return theme === 'dark' ? faMoon : faSun;
  };

  const getLabel = () => {
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        title={`Theme: ${getLabel()} (Click to toggle)`}
      >
        <div className="w-5 flex justify-center text-center">
          <FontAwesomeIcon icon={getIcon()} className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Theme: {getLabel()}</span>
      </button>
    );
  }

  // Default header toggle button (glassmorphic styling)
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-xl border border-gray-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-gray-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Toggle theme"
      title={`Current: ${getLabel()} - Click to change`}
    >
      <FontAwesomeIcon icon={getIcon()} className="w-4 h-4 animate-pop-in" />
    </button>
  );
}
