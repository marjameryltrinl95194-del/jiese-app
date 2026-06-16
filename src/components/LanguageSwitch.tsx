import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Language } from '../i18n/types';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.segment, language === 'zh' && styles.active]}
        onPress={() => setLanguage('zh')}
      >
        <Text style={[styles.text, language === 'zh' && styles.activeText]}>
          {t('languageChinese')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.segment, language === 'en' && styles.active]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.text, language === 'en' && styles.activeText]}>
          {t('languageEnglish')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeText: {
    color: '#fff',
  },
});
