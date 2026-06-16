import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function AppHeader() {
  const { t, language } = useLanguage();
  const { mode, colors, toggle } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.titleWrap}>
        <Text style={[styles.appName, { color: colors.primary }]}>{t('appName')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {language === 'zh' ? 'Qinghe' : '清和'}
        </Text>
      </View>
      <TouchableOpacity style={[styles.themeBtn, { backgroundColor: colors.primaryLight }]} onPress={toggle}>
        <Text style={styles.themeIcon}>{mode === 'light' ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  titleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  appName: {
    ...typography.appName,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 2,
    letterSpacing: 3,
  },
  themeBtn: {
    position: 'absolute',
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
});
