import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToday } from '../utils/date';

const JOURNAL_KEY = '@qinghe/journal';

export interface JournalEntry {
  date: string;
  morning: string;
  evening: string;
  feeling: string | null; // great | good | ok | bad | terrible
}

export interface JournalData {
  entries: JournalEntry[];
}

export async function loadJournal(): Promise<JournalData> {
  try {
    const raw = await AsyncStorage.getItem(JOURNAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { entries: [] };
}

export async function saveJournalEntry(
  period: 'morning' | 'evening',
  text: string,
  feeling?: string,
): Promise<JournalData> {
  const data = await loadJournal();
  const today = getToday();
  let entry = data.entries.find((e) => e.date === today);

  if (!entry) {
    entry = { date: today, morning: '', evening: '', feeling: null };
    data.entries.push(entry);
  }

  if (period === 'morning') {
    entry.morning = text;
  } else {
    entry.evening = text;
    if (feeling) entry.feeling = feeling;
  }

  data.entries.sort((a, b) => b.date.localeCompare(a.date));
  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(data));
  return data;
}

export async function getTodayEntry(): Promise<JournalEntry | null> {
  const data = await loadJournal();
  const today = getToday();
  return data.entries.find((e) => e.date === today) || null;
}
