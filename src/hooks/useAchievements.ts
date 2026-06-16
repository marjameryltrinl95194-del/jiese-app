import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS, Achievement, checkNewAchievements } from '../utils/achievements';

const ACH_KEY = '@qinghe/achievements';

export function useAchievements(streak: number, totalDays: number, moneySaved: number) {
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ACH_KEY).then((raw) => {
      try {
        if (raw) setUnlockedKeys(JSON.parse(raw));
      } catch {}
    });
  }, []);

  // Check for new achievements when stats change
  useEffect(() => {
    if (unlockedKeys.length === 0 && totalDays === 0) return;

    const newlyUnlocked = checkNewAchievements(streak, totalDays, moneySaved, unlockedKeys);
    if (newlyUnlocked.length > 0) {
      const first = newlyUnlocked[0];
      const updated = [...unlockedKeys, ...newlyUnlocked.map((a) => a.key)];
      setUnlockedKeys(updated);
      AsyncStorage.setItem(ACH_KEY, JSON.stringify(updated));
      setNewAchievement(first);
    }
  }, [streak, totalDays, moneySaved]);

  const dismissNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedKeys.includes(a.key));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedKeys.includes(a.key));

  return {
    newAchievement,
    dismissNewAchievement,
    unlockedAchievements,
    lockedAchievements,
    total: ACHIEVEMENTS.length,
    unlocked: unlockedKeys.length,
  };
}
