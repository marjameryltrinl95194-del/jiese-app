import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { formatMonthYear } from '../utils/date';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  year: number;
  month: number;
  lang: 'zh' | 'en';
  onPrev: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export default function MonthNavigator({
  year,
  month,
  lang,
  onPrev,
  onNext,
  canGoNext,
  canGoPrev,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrev}
        disabled={!canGoPrev}
        style={[styles.arrowBtn, !canGoPrev && styles.disabled]}
      >
        <Text style={[styles.arrow, !canGoPrev && styles.arrowDisabled]}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{formatMonthYear(year, month, lang)}</Text>
      <TouchableOpacity
        onPress={onNext}
        disabled={!canGoNext}
        style={[styles.arrowBtn, !canGoNext && styles.disabled]}
      >
        <Text style={[styles.arrow, !canGoNext && styles.arrowDisabled]}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  arrow: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  arrowDisabled: {
    color: colors.textLight,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
