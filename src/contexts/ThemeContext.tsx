import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { lightTheme, darkTheme } from '../utils/colors';
import type { ThemeMode, ThemeColors } from '../types';
import { STORAGE_KEYS } from '../types';

interface ThemeContextType {
  colors: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: lightTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = () => {
      try {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine the actual theme to use
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);
  const colors = isDark ? darkTheme : lightTheme;

  // Apply theme class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const value: ThemeContextType = {
    colors,
    themeMode,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context.colors;
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  return {
    themeMode: context.themeMode,
    setThemeMode: context.setThemeMode,
    isDark: context.isDark,
  };
};
