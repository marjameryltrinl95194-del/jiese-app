import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props { checkIns: string[] }

export default function ProgressChart({ checkIns }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();

  const days: { label: string; checked: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    days.push({ label: dayNames[d.getDay()], checked: checkIns.includes(ds) });
  }

  const weeks: { label: string; count: number; total: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(); date.setDate(date.getDate() - (w*7+d));
      const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      if (checkIns.includes(ds)) count++;
    }
    const endDate = new Date(); endDate.setDate(endDate.getDate() - w*7);
    weeks.push({ label: `${endDate.getMonth()+1}/${endDate.getDate()}`, count, total: 7 });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>📊 {t('chartCheckInTrend')}</Text>
      <View style={styles.barRow}>
        {days.map((d, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, { backgroundColor: d.checked ? colors.primary : colors.border }]} />
            <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{d.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.weekRow}>
        {weeks.map((w, i) => (
          <View key={i} style={styles.weekCol}>
            <Text style={[styles.weekCount, { color: colors.primary }]}>{w.count}/{w.total}</Text>
            <Text style={[styles.weekLabel, { color: colors.textSecondary }]}>{t('chartWeeklyStats')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: spacing.lg, marginHorizontal: spacing.md, marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '600', marginBottom: spacing.lg },
  barRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.xl },
  barCol: { alignItems: 'center' },
  bar: { width: 24, height: 80, borderRadius: 12, marginBottom: spacing.xs },
  barLabel: { fontSize: 11 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around' },
  weekCol: { alignItems: 'center' },
  weekCount: { fontSize: 18, fontWeight: '700' },
  weekLabel: { fontSize: 11 },
});
