import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/types';

const SETTINGS_KEY = '@qinghe/settings';

export interface AppSettings {
  language: Language;
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { language: 'zh' };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
