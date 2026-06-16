import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const MONEY_KEY = '@qinghe/dailyAmount';

interface Props {
  totalDays: number;
}

export default function MoneyCounter({ totalDays }: Props) {
  const { t } = useLanguage();
  const [dailyAmount, setDailyAmount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(MONEY_KEY).then((raw) => {
      if (raw) {
        const v = parseFloat(raw);
        if (v > 0) setDailyAmount(v);
      }
    });
  }, []);

  const totalSaved = dailyAmount * totalDays;

  const handleSave = () => {
    const v = parseFloat(inputValue);
    if (v > 0) {
      setDailyAmount(v);
      AsyncStorage.setItem(MONEY_KEY, String(v));
    }
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💵 {t('moneySaved')}</Text>
      <Text style={styles.amount}>
        {t('moneyCurrency')}{totalSaved.toLocaleString()}
      </Text>
      <Text style={styles.sub}>{t('moneyTotal')}</Text>

      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder={t('moneyEditHint')}
            placeholderTextColor={colors.textLight}
            autoFocus
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => { setInputValue(String(dailyAmount || '')); setEditing(true); }}>
          <Text style={styles.editHint}>
            {dailyAmount > 0 ? `${t('moneyPerDay')}: ${t('moneyCurrency')}${dailyAmount}` : t('moneySetDaily')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  amount: { ...typography.streakNumber, color: colors.primary, fontSize: 40 },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: -4 },
  editHint: { fontSize: 13, color: colors.primary, marginTop: spacing.sm },
  editRow: { flexDirection: 'row', marginTop: spacing.sm, width: '100%' },
  input: {
    flex: 1, borderWidth: 1, borderColor: colors.primary,
    borderRadius: 8, padding: spacing.sm, fontSize: 15, color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: spacing.md, justifyContent: 'center', marginLeft: spacing.sm,
  },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});
