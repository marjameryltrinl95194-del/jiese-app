import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.segment, language === 'zh' && { backgroundColor: colors.primary }]}
        onPress={() => setLanguage('zh')}
      >
        <Text style={[styles.text, { color: language === 'zh' ? '#fff' : colors.textSecondary }]}>
          {t('languageChinese')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.segment, language === 'en' && { backgroundColor: colors.primary }]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.text, { color: language === 'en' ? '#fff' : colors.textSecondary }]}>
          {t('languageEnglish')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 10, padding: 2 },
  segment: { flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 8, alignItems: 'center' },
  text: { fontSize: 15, fontWeight: '500' },
});
