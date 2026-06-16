import { useState, useEffect, useCallback } from 'react';
import {
  loadJournal,
  saveJournalEntry,
  getTodayEntry,
  JournalData,
  JournalEntry,
} from '../storage/journalStorage';

export function useJournal() {
  const [data, setData] = useState<JournalData>({ entries: [] });
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [d, t] = await Promise.all([loadJournal(), getTodayEntry()]);
    setData(d);
    setTodayEntry(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveEntry = useCallback(
    async (period: 'morning' | 'evening', text: string, feeling?: string) => {
      const newData = await saveJournalEntry(period, text, feeling);
      setData(newData);
      const updated = newData.entries.find((e) => e.date === (todayEntry?.date || ''));
      setTodayEntry(updated || null);
    },
    [todayEntry],
  );

  return { data, todayEntry, loading, saveEntry, refresh };
}
