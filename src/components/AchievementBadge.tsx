import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  icon: string;
  nameKey: string;
  descKey: string;
  unlocked: boolean;
}

export default function AchievementBadge({ icon, nameKey, descKey, unlocked }: Props) {
  const { t } = useLanguage();

  return (
    <View style={[styles.container, !unlocked && styles.locked]}>
      <View style={[styles.iconCircle, !unlocked && styles.iconLocked]}>
        <Text style={styles.icon}>{unlocked ? icon : '🔒'}</Text>
      </View>
      <Text style={[styles.name, !unlocked && styles.textLocked]}>{t(nameKey as any)}</Text>
      <Text style={styles.desc}>{t(descKey as any)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
    margin: spacing.sm,
  },
  locked: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconLocked: {
    backgroundColor: colors.border,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textLocked: {
    color: colors.textLight,
  },
  desc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
