import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { HEALTH_MILESTONES, getCurrentHealthMilestone, getNextHealthMilestone } from '../utils/healthTimeline';
import { spacing } from '../theme/spacing';

interface Props { currentDays: number }

export default function HealthTimeline({ currentDays }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const current = getCurrentHealthMilestone(currentDays);
  const next = getNextHealthMilestone(currentDays);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>❤️ {t('healthTimeline')}</Text>
      <View style={styles.timeline}>
        {HEALTH_MILESTONES.map((m, i) => {
          const reached = currentDays >= m.day;
          const isCurrent = m.key === current.key;
          return (
            <View key={m.key} style={styles.row}>
              <View style={[
                styles.dot,
                { backgroundColor: reached ? colors.primary : colors.border },
                isCurrent && { backgroundColor: colors.primary, width: 18, height: 18, borderRadius: 9 },
              ]} />
              {i < HEALTH_MILESTONES.length - 1 && (
                <View style={[styles.line, { backgroundColor: reached ? colors.primary : colors.border }]} />
              )}
              <View style={styles.textWrap}>
                <Text style={[styles.day, { color: reached ? colors.textPrimary : colors.textSecondary }]}>
                  {t('healthDay')}{m.day}
                </Text>
                <Text style={[styles.desc, { color: reached ? colors.textPrimary : colors.textSecondary }]} numberOfLines={2}>
                  {t(m.key as any)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      {next && (
        <Text style={[styles.next, { color: colors.primary }]}>
          🎯 {t('healthDay')}{next.day}: {t(next.key as any)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: spacing.lg, marginHorizontal: spacing.md, marginBottom: spacing.md },
  title: { fontSize: 17, fontWeight: '600', marginBottom: spacing.md },
  timeline: { paddingLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 4, zIndex: 1 },
  line: { position: 'absolute', left: 14, top: 18, width: 2, height: '100%' },
  textWrap: { marginLeft: spacing.md, flex: 1, paddingBottom: spacing.md },
  day: { fontSize: 13, fontWeight: '600' },
  desc: { fontSize: 14, lineHeight: 20 },
  next: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: spacing.sm },
});
