import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { formatMonthYear } from '../utils/date';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props {
  year: number; month: number; lang: 'zh' | 'en';
  onPrev: () => void; onNext: () => void;
  canGoNext: boolean; canGoPrev: boolean;
}

export default function MonthNavigator({ year, month, lang, onPrev, onNext, canGoNext, canGoPrev }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev} disabled={!canGoPrev} style={[styles.arrowBtn, !canGoPrev && { opacity: 0.3 }]}>
        <Text style={[styles.arrow, { color: canGoPrev ? colors.primary : colors.textLight }]}>‹</Text>
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{formatMonthYear(year, month, lang)}</Text>
      <TouchableOpacity onPress={onNext} disabled={!canGoNext} style={[styles.arrowBtn, !canGoNext && { opacity: 0.3 }]}>
        <Text style={[styles.arrow, { color: canGoNext ? colors.primary : colors.textLight }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  arrowBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  arrow: { fontSize: 28, fontWeight: '300' },
  label: { fontSize: 17, fontWeight: '600' },
});
