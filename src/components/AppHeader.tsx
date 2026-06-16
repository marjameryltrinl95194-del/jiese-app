import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function AppHeader() {
  const { t, language } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{t('appName')}</Text>
      <Text style={styles.subtitle}>
        {language === 'zh' ? 'Qinghe' : '清和'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  appName: {
    ...typography.appName,
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 3,
  },
});
