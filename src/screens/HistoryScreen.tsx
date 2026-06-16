import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCheckIn } from '../hooks/useCheckIn';
import { useStats } from '../hooks/useStats';
import { useLanguage } from '../i18n/LanguageContext';
import AppHeader from '../components/AppHeader';
import MonthNavigator from '../components/MonthNavigator';
import CalendarGrid from '../components/CalendarGrid';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';
import { getToday } from '../utils/date';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { checkIns } = useCheckIn();
  const { currentStreak, longestStreak, totalDays } = useStats(checkIns);

  const today = getToday();
  const [todayY, todayM] = today.split('-').map(Number);

  const [year, setYear] = useState(todayY);
  const [month, setMonth] = useState(todayM);

  const canGoNext = year < todayY || (year === todayY && month < todayM);
  const canGoPrev = useMemo(() => {
    if (checkIns.length === 0) return false;
    const firstDate = checkIns[0];
    const [fy, fm] = firstDate.split('-').map(Number);
    return year > fy || (year === fy && month > fm);
  }, [checkIns, year, month]);

  const handlePrev = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  if (checkIns.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AppHeader />
        <EmptyState title={t('emptyHistory')} hint={t('emptyHistoryHint')} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader />

      <MonthNavigator
        year={year}
        month={month}
        lang={language}
        onPrev={handlePrev}
        onNext={handleNext}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      />

      <CalendarGrid year={year} month={month} checkIns={checkIns} />

      <View style={styles.statsRow}>
        <StatsCard value={totalDays} label={t('totalDays')} />
        <StatsCard value={currentStreak} label={t('currentStreak')} />
        <StatsCard value={longestStreak} label={t('longestStreak')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.lg,
  },
});
