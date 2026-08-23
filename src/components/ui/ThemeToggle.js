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
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-800 transition-all duration-200"
        title={`Theme: ${getLabel()} (Click to toggle)`}
      >
        <div className="w-5 flex justify-center text-center">
          <FontAwesomeIcon icon={getIcon()} className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-amber-400'}`} />
        </div>
        <span className="text-sm font-medium">Theme: {getLabel()}</span>
        <span className={`ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {theme}
        </span>
      </button>
    );
  }

  // Default header toggle button (glassmorphic styling)
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/90 backdrop-blur-md text-gray-700 dark:text-zinc-200 hover:bg-white/90 dark:hover:bg-zinc-800 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Toggle theme"
      title={`Current: ${getLabel()} - Click to change`}
    >
      <FontAwesomeIcon icon={getIcon()} className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-amber-500'}`} />
    </button>
  );
}
