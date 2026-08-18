import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = ({ className = '', variant = 'icon' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'border-gray-800 bg-gray-900 text-yellow-400 hover:bg-gray-800 hover:text-yellow-300'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 text-yellow-400 animate-in spin-in-180 duration-300" />
            <span className="text-gray-200 text-xs">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-gray-600 animate-in spin-in-180 duration-300" />
            <span className="text-gray-700 text-xs">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
        isDark
          ? 'border-gray-800 bg-gray-900 text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 shadow-2xs'
          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-2xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-gray-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
