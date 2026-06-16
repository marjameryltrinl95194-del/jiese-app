import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props { icon: string; nameKey: string; descKey: string; unlocked: boolean }

export default function AchievementBadge({ icon, nameKey, descKey, unlocked }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, !unlocked && { opacity: 0.4 }]}>
      <View style={[styles.iconCircle, { backgroundColor: unlocked ? colors.primaryLight : colors.border }]}>
        <Text style={styles.icon}>{unlocked ? icon : '🔒'}</Text>
      </View>
      <Text style={[styles.name, { color: unlocked ? colors.textPrimary : colors.textLight }]}>{t(nameKey as any)}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{t(descKey as any)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 100, margin: spacing.sm },
  iconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  icon: { fontSize: 24 },
  name: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  desc: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
