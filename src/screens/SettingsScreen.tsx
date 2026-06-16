import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import AppHeader from '../components/AppHeader';
import LanguageSwitch from '../components/LanguageSwitch';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader />

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settingsLanguage')}</Text>
        <LanguageSwitch />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('aboutTitle')}</Text>
        <Text style={styles.aboutText}>{t('aboutDescription')}</Text>
        <Text style={styles.version}>
          {t('version')} 1.0.0
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        {language === 'zh' ? '清和 · Qinghe' : 'Qinghe · 清和'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aboutText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  version: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginTop: spacing.md,
  },
  footer: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
    letterSpacing: 1,
  },
});
