import { useMemo } from 'react';
import { calculateCurrentStreak, calculateLongestStreak, getMotivationKey } from '../utils/streaks';
import { getToday } from '../utils/date';

export function useStats(checkIns: string[]) {
  return useMemo(() => {
    const today = getToday();
    const currentStreak = calculateCurrentStreak(checkIns, today);
    const longestStreak = calculateLongestStreak(checkIns);
    const totalDays = checkIns.length;
    const motivationKey = getMotivationKey(currentStreak);

    return {
      currentStreak,
      longestStreak,
      totalDays,
      motivationKey,
    };
  }, [checkIns]);
}
