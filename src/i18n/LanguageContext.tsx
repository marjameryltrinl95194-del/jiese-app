import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, TranslationMap } from './types';
import { translations } from './translations';

const SETTINGS_KEY = '@qinghe/settings';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationMap) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'zh',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [ready, setReady] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.language === 'en' || parsed.language === 'zh') {
            setLanguageState(parsed.language);
          }
        } catch {}
      }
      setReady(true);
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ language: lang }));
  }, []);

  const t = useCallback(
    (key: keyof TranslationMap): string => {
      return translations[language]?.[key] ?? translations.zh[key] ?? key;
    },
    [language],
  );

  if (!ready) return null; // brief flash prevention

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
