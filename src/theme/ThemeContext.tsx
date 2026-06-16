import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Light Palette ──────────────────────────────────
const lightColors = {
  primary: '#4A9E7B',
  primaryLight: '#E8F5EF',
  primaryDark: '#3A7D5E',
  background: '#FAFBF9',
  surface: '#FFFFFF',
  textPrimary: '#1A1D20',
  textSecondary: '#6B7280',
  textLight: '#BEC5C6',
  border: '#E5E7EB',
  success: '#4A9E7B',
  warning: '#F0C75E',
  error: '#EF4444',
  tabActive: '#4A9E7B',
  tabInactive: '#9CA3AF',
  tabBarBg: '#FFFFFF',
  cardShadow: '#000',
  overlay: 'rgba(0,0,0,0.5)',
  sosBg: '#EF4444',
  sosText: '#FFFFFF',
};

// ─── Dark Palette ───────────────────────────────────
const darkColors = {
  primary: '#5FC98E',
  primaryLight: '#1A3326',
  primaryDark: '#4A9E7B',
  background: '#0F1115',
  surface: '#1A1D24',
  textPrimary: '#F0F1F3',
  textSecondary: '#9CA3AF',
  textLight: '#4B5563',
  border: '#2D3139',
  success: '#5FC98E',
  warning: '#F0C75E',
  error: '#F87171',
  tabActive: '#5FC98E',
  tabInactive: '#6B7280',
  tabBarBg: '#1A1D24',
  cardShadow: 'transparent',
  overlay: 'rgba(0,0,0,0.7)',
  sosBg: '#DC2626',
  sosText: '#FFFFFF',
};

export type ThemeColors = typeof lightColors;
export type ThemeMode = 'light' | 'dark';

const THEME_KEY = '@qinghe/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightColors,
  toggle: () => {},
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light') {
        setModeState(saved);
      } else if (systemScheme) {
        setModeState(systemScheme as ThemeMode);
      }
      setReady(true);
    });
  }, [systemScheme]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(THEME_KEY, m);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const colors = mode === 'dark' ? darkColors : lightColors;

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
