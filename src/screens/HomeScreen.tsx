import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCheckIn } from '../hooks/useCheckIn';
import { useStats } from '../hooks/useStats';
import { useLanguage } from '../i18n/LanguageContext';
import AppHeader from '../components/AppHeader';
import StreakDisplay from '../components/StreakDisplay';
import CheckInButton from '../components/CheckInButton';
import StatsCard from '../components/StatsCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { checkIns, todayChecked, loading, doCheckIn } = useCheckIn();
  const { currentStreak, longestStreak, totalDays, motivationKey } = useStats(checkIns);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader />

      <StreakDisplay streak={currentStreak} />

      <CheckInButton checkedIn={todayChecked} loading={loading} onCheckIn={doCheckIn} />

      <Text style={styles.motivation}>{t(motivationKey as any)}</Text>

      <View style={styles.statsRow}>
        <StatsCard value={totalDays} label={t('totalDays')} />
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
  motivation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
});
