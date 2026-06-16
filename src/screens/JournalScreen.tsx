import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJournal } from '../hooks/useJournal';
import { useLanguage } from '../i18n/LanguageContext';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';
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
  const { todayEntry, saveEntry, refresh } = useJournal();
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!todayEntry && !morningText) {
    // Check if truly empty
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader />

      {saved && <Text style={styles.savedBanner}>✅ {t('journalSaved')}</Text>}

      {/* Morning Pledge */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>☀️ {t('journalMorning')}</Text>
        <TextInput
          style={styles.input}
          value={morningText}
          onChangeText={setMorningText}
          placeholder={t('journalMorningHint')}
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.saveBtn, !morningText.trim() && styles.saveBtnDisabled]}
          onPress={() => handleSave('morning')}
          disabled={!morningText.trim()}
        >
          <Text style={styles.saveBtnText}>{t('journalSave')}</Text>
        </TouchableOpacity>
      </View>

      {/* Feeling Check */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💭 {t('journalFeeling')}</Text>
        <View style={styles.feelingRow}>
          {FEELINGS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.feelingBtn, feeling === f.key && styles.feelingActive]}
              onPress={() => setFeeling(f.key)}
            >
              <Text style={styles.feelingEmoji}>{f.emoji}</Text>
              <Text style={[styles.feelingLabel, feeling === f.key && styles.feelingLabelActive]}>
                {t(`feeling_${f.key}` as any)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Evening Reflection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌙 {t('journalEvening')}</Text>
        <TextInput
          style={styles.input}
          value={eveningText}
          onChangeText={setEveningText}
          placeholder={t('journalEveningHint')}
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.saveBtn, !eveningText.trim() && styles.saveBtnDisabled]}
          onPress={() => handleSave('evening')}
          disabled={!eveningText.trim()}
        >
          <Text style={styles.saveBtnText}>{t('journalSave')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  savedBanner: {
    backgroundColor: colors.primaryLight, color: colors.primary,
    textAlign: 'center', padding: spacing.sm, fontWeight: '600', marginHorizontal: spacing.md, borderRadius: 8,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    marginHorizontal: spacing.md, marginBottom: spacing.md,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    padding: spacing.md, fontSize: 15, color: colors.textPrimary,
    minHeight: 100, lineHeight: 22,
  },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', marginTop: spacing.md,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  feelingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feelingBtn: { alignItems: 'center', padding: spacing.sm, borderRadius: 10, width: '18%' },
  feelingActive: { backgroundColor: colors.primaryLight },
  feelingEmoji: { fontSize: 30 },
  feelingLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4 },
  feelingLabelActive: { color: colors.primary, fontWeight: '600' },
});
