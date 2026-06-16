import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJournal } from '../hooks/useJournal';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../components/AppHeader';
import { spacing } from '../theme/spacing';

const FEELINGS = [
  { key: 'great', emoji: '😄' },
  { key: 'good', emoji: '🙂' },
  { key: 'ok', emoji: '😐' },
  { key: 'bad', emoji: '😔' },
  { key: 'terrible', emoji: '😢' },
];

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { todayEntry, saveEntry } = useJournal();
  const [morningText, setMorningText] = useState('');
  const [eveningText, setEveningText] = useState('');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (todayEntry) {
      setMorningText(todayEntry.morning);
      setEveningText(todayEntry.evening);
      setFeeling(todayEntry.feeling);
    }
  }, [todayEntry]);

  const handleSave = async (period: 'morning' | 'evening') => {
    const text = period === 'morning' ? morningText : eveningText;
    if (!text.trim()) return;
    await saveEntry(period, text, feeling || undefined);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView style={[{ paddingTop: insets.top, backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <AppHeader />
      {saved && <Text style={[styles.savedBanner, { backgroundColor: colors.primaryLight, color: colors.primary }]}>✅ {t('journalSaved')}</Text>}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>☀️ {t('journalMorning')}</Text>
        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]} value={morningText} onChangeText={setMorningText} placeholder={t('journalMorningHint')} placeholderTextColor={colors.textLight} multiline numberOfLines={4} textAlignVertical="top" />
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: morningText.trim() ? colors.primary : colors.border }]} onPress={() => handleSave('morning')} disabled={!morningText.trim()}>
          <Text style={styles.saveBtnText}>{t('journalSave')}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>💭 {t('journalFeeling')}</Text>
        <View style={styles.feelingRow}>
          {FEELINGS.map((f) => (
            <TouchableOpacity key={f.key} style={[styles.feelingBtn, feeling === f.key && { backgroundColor: colors.primaryLight }]} onPress={() => setFeeling(f.key)}>
              <Text style={styles.feelingEmoji}>{f.emoji}</Text>
              <Text style={[styles.feelingLabel, { color: feeling === f.key ? colors.primary : colors.textSecondary }]}>{t(`feeling_${f.key}` as any)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>🌙 {t('journalEvening')}</Text>
        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]} value={eveningText} onChangeText={setEveningText} placeholder={t('journalEveningHint')} placeholderTextColor={colors.textLight} multiline numberOfLines={4} textAlignVertical="top" />
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: eveningText.trim() ? colors.primary : colors.border }]} onPress={() => handleSave('evening')} disabled={!eveningText.trim()}>
          <Text style={styles.saveBtnText}>{t('journalSave')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  savedBanner: { textAlign: 'center', padding: spacing.sm, fontWeight: '600', marginHorizontal: spacing.md, borderRadius: 8 },
  card: { borderRadius: 12, padding: spacing.lg, marginHorizontal: spacing.md, marginBottom: spacing.md },
  cardTitle: { fontSize: 17, fontWeight: '600', marginBottom: spacing.md },
  input: { borderWidth: 1, borderRadius: 10, padding: spacing.md, fontSize: 15, minHeight: 100, lineHeight: 22 },
  saveBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: spacing.md },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  feelingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feelingBtn: { alignItems: 'center', padding: spacing.sm, borderRadius: 10, width: '18%' },
  feelingEmoji: { fontSize: 30 },
  feelingLabel: { fontSize: 10, marginTop: 4 },
});
