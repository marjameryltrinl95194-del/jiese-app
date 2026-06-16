import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCheckIn } from '../hooks/useCheckIn';
import { useStats } from '../hooks/useStats';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../components/AppHeader';
import MonthNavigator from '../components/MonthNavigator';
import CalendarGrid from '../components/CalendarGrid';
import StatsCard from '../components/StatsCard';
import ProgressChart from '../components/ProgressChart';
import EmptyState from '../components/EmptyState';
import { getToday } from '../utils/date';
import { spacing } from '../theme/spacing';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const { checkIns } = useCheckIn();
  const { currentStreak, longestStreak, totalDays } = useStats(checkIns);
  const today = getToday();
  const [todayY, todayM] = today.split('-').map(Number);
  const [year, setYear] = useState(todayY);
  const [month, setMonth] = useState(todayM);

  const canGoNext = year < todayY || (year === todayY && month < todayM);
  const canGoPrev = useMemo(() => {
    if (checkIns.length === 0) return false;
    const [fy, fm] = checkIns[0].split('-').map(Number);
    return year > fy || (year === fy && month > fm);
  }, [checkIns, year, month]);

  if (checkIns.length === 0) {
    return (
      <View style={[{ paddingTop: insets.top, flex: 1, backgroundColor: colors.background }]}>
        <AppHeader />
        <EmptyState title={t('emptyHistory')} hint={t('emptyHistoryHint')} />
      </View>
    );
  }

  return (
    <ScrollView style={[{ paddingTop: insets.top, backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <AppHeader />
      <MonthNavigator year={year} month={month} lang={language} onPrev={() => month === 1 ? (setYear(year-1), setMonth(12)) : setMonth(month-1)} onNext={() => month === 12 ? (setYear(year+1), setMonth(1)) : setMonth(month+1)} canGoNext={canGoNext} canGoPrev={canGoPrev} />
      <CalendarGrid year={year} month={month} checkIns={checkIns} />
      <View style={styles.statsRow}>
        <StatsCard value={totalDays} label={t('totalDays')} />
        <StatsCard value={currentStreak} label={t('currentStreak')} />
        <StatsCard value={longestStreak} label={t('longestStreak')} />
      </View>
      <ProgressChart checkIns={checkIns} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md },
});
