import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const MONEY_KEY = '@qinghe/dailyAmount';

interface Props { totalDays: number }

export default function MoneyCounter({ totalDays }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [dailyAmount, setDailyAmount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(MONEY_KEY).then((raw) => {
      if (raw) { const v = parseFloat(raw); if (v > 0) setDailyAmount(v); }
    });
  }, []);

  const totalSaved = dailyAmount * totalDays;
  const handleSave = () => {
    const v = parseFloat(inputValue);
    if (v > 0) { setDailyAmount(v); AsyncStorage.setItem(MONEY_KEY, String(v)); }
    setEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>💵 {t('moneySaved')}</Text>
      <Text style={[styles.amount, { color: colors.primary }]}>{t('moneyCurrency')}{totalSaved.toLocaleString()}</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>{t('moneyTotal')}</Text>
      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={[styles.input, { borderColor: colors.primary, color: colors.textPrimary }]}
            value={inputValue} onChangeText={setInputValue} keyboardType="numeric"
            placeholder={t('moneyEditHint')} placeholderTextColor={colors.textLight} autoFocus
          />
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => { setInputValue(String(dailyAmount || '')); setEditing(true); }}>
          <Text style={[styles.editHint, { color: colors.primary }]}>
            {dailyAmount > 0 ? `${t('moneyPerDay')}: ${t('moneyCurrency')}${dailyAmount}` : t('moneySetDaily')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: spacing.lg, marginHorizontal: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '600', marginBottom: spacing.sm },
  amount: { ...typography.streakNumber, fontSize: 40 },
  sub: { fontSize: 12, marginTop: -4 },
  editHint: { fontSize: 13, marginTop: spacing.sm },
  editRow: { flexDirection: 'row', marginTop: spacing.sm, width: '100%' },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: spacing.sm, fontSize: 15 },
  saveBtn: { borderRadius: 8, paddingHorizontal: spacing.md, justifyContent: 'center', marginLeft: spacing.sm },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});
