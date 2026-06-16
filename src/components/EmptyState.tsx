import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props { title: string; hint: string }

export default function EmptyState({ title, hint }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌱</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.headline, textAlign: 'center', marginBottom: spacing.sm },
  hint: { ...typography.bodySmall, textAlign: 'center', lineHeight: 22 },
});
