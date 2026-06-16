import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDaysInMonth, getFirstDayOfWeek, getToday, dateToStr } from '../utils/date';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props { year: number; month: number; checkIns: string[] }

export default function CalendarGrid({ year, month, checkIns }: Props) {
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const today = getToday();
  const checkInSet = new Set(checkIns);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const weekDays = language === 'zh'
    ? [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')]
    : [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

  const startOffset = language === 'zh' ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {weekDays.map((day) => (
          <View key={day} style={styles.cell}>
            <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>
      {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {cells.slice(rowIdx * 7, (rowIdx + 1) * 7).map((day, colIdx) => {
            if (day === null) return <View key={`empty-${colIdx}`} style={styles.cell} />;
            const dateStr = dateToStr(year, month, day);
            const isChecked = checkInSet.has(dateStr);
            const isTodayDate = dateStr === today;
            return (
              <View key={day} style={styles.cell}>
                <View style={[
                  styles.dayCircle,
                  isChecked && { backgroundColor: colors.primary },
                  isTodayDate && !isChecked && { borderWidth: 1.5, borderColor: colors.primary },
                ]}>
                  <Text style={[
                    styles.dayText,
                    { color: colors.textPrimary },
                    isChecked && { color: '#fff', fontWeight: '600' },
                    isTodayDate && !isChecked && { color: colors.primary, fontWeight: '600' },
                  ]}>{day}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.sm },
  row: { flexDirection: 'row' },
  cell: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 2 },
  weekDayText: { fontSize: 12, fontWeight: '500' },
  dayCircle: { width: '85%', aspectRatio: 1, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 14 },
});
