import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { HEALTH_MILESTONES, getCurrentHealthMilestone, getNextHealthMilestone } from '../utils/healthTimeline';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  currentDays: number;
}

export default function HealthTimeline({ currentDays }: Props) {
  const { t } = useLanguage();
  const current = getCurrentHealthMilestone(currentDays);
  const next = getNextHealthMilestone(currentDays);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ {t('healthTimeline')}</Text>
      <View style={styles.timeline}>
        {HEALTH_MILESTONES.map((m, i) => {
          const reached = currentDays >= m.day;
          const isCurrent = m.key === current.key;
          return (
            <View key={m.key} style={styles.row}>
              <View style={[styles.dot, reached && styles.dotReached, isCurrent && styles.dotCurrent]} />
              {i < HEALTH_MILESTONES.length - 1 && (
                <View style={[styles.line, reached && styles.lineReached]} />
              )}
              <View style={styles.textWrap}>
                <Text style={[styles.day, reached && styles.textReached]}>
                  {t('healthDay')}{m.day}
                </Text>
                <Text style={[styles.desc, reached && styles.textReached]} numberOfLines={2}>
                  {t(m.key as any)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      {next && (
        <Text style={styles.next}>
          🎯 {t('healthDay')}{next.day}: {t(next.key as any)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  title: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  timeline: { paddingLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.border, marginTop: 4, zIndex: 1,
  },
  dotReached: { backgroundColor: colors.primary },
  dotCurrent: { backgroundColor: colors.primary, width: 18, height: 18, borderRadius: 9 },
  line: {
    position: 'absolute', left: 14, top: 18, width: 2,
    height: '100%', backgroundColor: colors.border,
  },
  lineReached: { backgroundColor: colors.primary },
  textWrap: { marginLeft: spacing.md, flex: 1, paddingBottom: spacing.md },
  day: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  desc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  textReached: { color: colors.textPrimary },
  next: { fontSize: 14, color: colors.primary, fontWeight: '500', textAlign: 'center', marginTop: spacing.sm },
});
