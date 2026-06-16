import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props { streak: number }

export default function StreakDisplay({ streak }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [streak, fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.number, { color: colors.primary }]}>{streak}</Text>
      <Text style={[styles.label, { color: colors.primary }]}>{t('days')}</Text>
      <Text style={[styles.subLabel, { color: colors.textSecondary }]}>{t('currentStreak')}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  number: { ...typography.streakNumber },
  label: { ...typography.body, fontWeight: '500', marginTop: -4 },
  subLabel: { ...typography.bodySmall, marginTop: spacing.xs },
});
