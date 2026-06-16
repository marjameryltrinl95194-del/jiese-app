import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  loadCheckInData,
  checkInToday,
  isTodayCheckedIn,
  CheckInData,
} from '../storage/checkInStorage';

export function useCheckIn() {
  const [data, setData] = useState<CheckInData>({ version: 1, checkIns: [], quitDate: null });
  const [todayChecked, setTodayChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const d = await loadCheckInData();
    const checked = await isTodayCheckedIn();
    setData(d);
    setTodayChecked(checked);
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Refresh when app returns to foreground (midnight crossing)
  useEffect(() => {
    const handler = (state: AppStateStatus) => {
      if (state === 'active') {
        refresh();
      }
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, [refresh]);

  const doCheckIn = useCallback(async () => {
    setLoading(true);
    const updated = await checkInToday();
    setData(updated);
    setTodayChecked(true);
    setLoading(false);
    return updated;
  }, []);

  return {
    checkIns: data.checkIns,
    quitDate: data.quitDate,
    todayChecked,
    loading,
    doCheckIn,
    refresh,
  };
}
