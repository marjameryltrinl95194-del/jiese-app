import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  checkIns: string[];
}

export default function ProgressChart({ checkIns }: Props) {
  const { t } = useLanguage();

  // Build last 7 days data
  const days: { label: string; checked: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    days.push({ label: dayNames[d.getDay()], checked: checkIns.includes(ds) });
  }

  // Build last 4 weeks
  const weeks: { label: string; count: number; total: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    let count = 0;
    const totalDays = 7;
    for (let d = 0; d < 7; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (w * 7 + d));
      const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (checkIns.includes(ds)) count++;
    }
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - w * 7);
    weeks.push({
      label: `${endDate.getMonth() + 1}/${endDate.getDate()}`,
      count,
      total: totalDays,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 {t('chartCheckInTrend')}</Text>

      {/* Daily bars */}
      <View style={styles.barRow}>
        {days.map((d, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, d.checked ? styles.barActive : styles.barInactive]} />
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        ))}
      </View>

      {/* Weekly summary */}
      <View style={styles.weekRow}>
        {weeks.map((w, i) => (
          <View key={i} style={styles.weekCol}>
            <Text style={styles.weekCount}>
              {w.count}/{w.total}
            </Text>
            <Text style={styles.weekLabel}>{t('chartWeeklyStats')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.lg },
  barRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.xl },
  barCol: { alignItems: 'center' },
  bar: { width: 24, height: 80, borderRadius: 12, marginBottom: spacing.xs },
  barActive: { backgroundColor: colors.primary },
  barInactive: { backgroundColor: colors.border },
  barLabel: { fontSize: 11, color: colors.textSecondary },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around' },
  weekCol: { alignItems: 'center' },
  weekCount: { fontSize: 18, fontWeight: '700', color: colors.primary },
  weekLabel: { fontSize: 11, color: colors.textSecondary },
});
