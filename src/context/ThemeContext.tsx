import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'high-contrast') => void;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    mode: 'light',
    primaryColor: '#3b82f6',  // Modern blue
    accentColor: '#8b5cf6',   // Purple accent
  });

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    const app = document.querySelector('.App');
    
    console.log('Applying theme:', currentTheme.mode);
    
    // Remove all theme classes
    root.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme');
    body.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme');
    if (app) {
      app.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme');
    }
    
    // Add current theme class
    root.classList.add(`${currentTheme.mode}-theme`);
    body.classList.add(`${currentTheme.mode}-theme`);
    if (app) {
      app.classList.add(`${currentTheme.mode}-theme`);
    }
    
    console.log('Theme classes applied:', {
      root: root.className,
      body: body.className,
      app: app?.className
    });
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', currentTheme.primaryColor);
    root.style.setProperty('--accent-color', currentTheme.accentColor);
    
    // Apply theme-specific colors
    if (currentTheme.mode === 'dark') {
      root.style.setProperty('--bg-color', '#0f172a');  // Darker blue-gray background
      root.style.setProperty('--bg-secondary', '#1e293b');  // Slightly lighter for cards
      root.style.setProperty('--text-color', '#f1f5f9');  // Light blue-gray text
      root.style.setProperty('--text-secondary', '#94a3b8');  // Muted blue-gray
      root.style.setProperty('--border-color', '#334155');  // Subtle blue borders
      root.style.setProperty('--card-bg', '#1e293b');  // Card background
    } else if (currentTheme.mode === 'high-contrast') {
      root.style.setProperty('--bg-color', '#000000');
      root.style.setProperty('--bg-secondary', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--text-secondary', '#ffffff');
      root.style.setProperty('--border-color', '#ffffff');
      root.style.setProperty('--card-bg', '#1a1a1a');
    } else {
      root.style.setProperty('--bg-color', '#f8fafc');  // Lighter gray background
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-color', '#0f172a');  // Darker text for better contrast
      root.style.setProperty('--text-secondary', '#64748b');  // Muted slate color
      root.style.setProperty('--border-color', '#e2e8f0');  // Light slate borders
      root.style.setProperty('--card-bg', '#ffffff');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const modes: ('light' | 'dark' | 'high-contrast')[] = ['light', 'dark', 'high-contrast'];
      const currentIndex = modes.indexOf(prev.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...prev, mode: modes[nextIndex] };
    });
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'high-contrast') => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setPrimaryColor = (color: string) => {
    setTheme(prev => ({ ...prev, primaryColor: color }));
  };

  const setAccentColor = (color: string) => {
    setTheme(prev => ({ ...prev, accentColor: color }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        setPrimaryColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
