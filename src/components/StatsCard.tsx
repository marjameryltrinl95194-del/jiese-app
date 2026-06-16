import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props { value: number | string; label: string }

export default function StatsCard({ value, label }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.textPrimary }]}>
      <Text style={[styles.value, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, borderRadius: 12, paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm, alignItems: 'center', marginHorizontal: spacing.xs,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  value: { ...typography.statValue },
  label: { ...typography.statLabel, marginTop: 4 },
});
