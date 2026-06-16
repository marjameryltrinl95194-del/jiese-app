import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { usePremium } from '../hooks/usePremium';
import { useCheckIn } from '../hooks/useCheckIn';
import AppHeader from '../components/AppHeader';
import LanguageSwitch from '../components/LanguageSwitch';
import PremiumModal from '../components/PremiumModal';
import { loadReminderSettings, saveReminderSettings, requestNotificationPermission, scheduleReminder, cancelReminder } from '../utils/notifications';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { mode, colors, setMode } = useTheme();
  const { premium, subscribe } = usePremium();
  const { checkIns } = useCheckIn();
  const [showPremium, setShowPremium] = useState(false);
  const [morningReminder, setMorningReminder] = useState(false);
  const [eveningReminder, setEveningReminder] = useState(false);

  React.useEffect(() => { loadReminderSettings().then(s => { setMorningReminder(s.morningEnabled); setEveningReminder(s.eveningEnabled); }); }, []);

  const toggleMorning = async (val: boolean) => {
    if (val && !premium.isPremium) { setShowPremium(true); return; }
    if (val) { if (!(await requestNotificationPermission())) { Alert.alert('Permission needed'); return; } await scheduleReminder('morning', t('appName'), t('journalMorningHint'), '08:00'); }
    else await cancelReminder('morning');
    setMorningReminder(val);
    await saveReminderSettings({ morningEnabled: val, eveningEnabled: eveningReminder, morningTime: '08:00', eveningTime: '21:00' });
  };
  const toggleEvening = async (val: boolean) => {
    if (val && !premium.isPremium) { setShowPremium(true); return; }
    if (val) { if (!(await requestNotificationPermission())) { Alert.alert('Permission needed'); return; } await scheduleReminder('evening', t('appName'), t('journalEveningHint'), '21:00'); }
    else await cancelReminder('evening');
    setEveningReminder(val);
    await saveReminderSettings({ morningEnabled: morningReminder, eveningEnabled: val, morningTime: '08:00', eveningTime: '21:00' });
  };

  const handleExport = () => {
    if (!premium.isPremium) { setShowPremium(true); return; }
    const csv = 'date\n' + checkIns.slice(-30).join('\n');
    Alert.alert(t('exportCSV'), csv || t('noData'), [{ text: t('close') }]);
  };

  const Section = ({ icon, title, subtitle, onPress, right }: any) => (
    <TouchableOpacity style={[styles.section, { backgroundColor: colors.surface }]} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {right || (onPress && <Text style={[styles.arrow, { color: colors.textLight }]}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[{ paddingTop: insets.top, backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <AppHeader />

      {/* Theme */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={styles.rowIcon}>{mode === 'light' ? '☀️' : '🌙'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{mode === 'light' ? '浅色模式' : '深色模式'}</Text>
        </View>
        <TouchableOpacity style={[styles.themeToggle, { backgroundColor: colors.primaryLight }]} onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          <Text style={styles.themeToggleIcon}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <Section icon="💎" title={t('premiumTitle')} subtitle={premium.isPremium ? `✅ ${t('premiumActive')}` : t('premiumDesc')} onPress={() => setShowPremium(true)} />
      <Section icon="🌐" title={t('settingsLanguage')} right={<LanguageSwitch />} />

      <Section icon="🔔" title={t('reminders')} subtitle={premium.isPremium ? t('premiumActive') : `🔒 ${t('premium')}`} />
      <View style={[styles.subSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.subText, { color: colors.textPrimary }]}>{t('reminderMorning')} (08:00)</Text>
        <Switch value={morningReminder} onValueChange={toggleMorning} trackColor={{ true: colors.primary }} thumbColor="#fff" />
      </View>
      <View style={[styles.subSection, { backgroundColor: colors.surface, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: -8, marginBottom: spacing.sm }]}>
        <Text style={[styles.subText, { color: colors.textPrimary }]}>{t('reminderEvening')} (21:00)</Text>
        <Switch value={eveningReminder} onValueChange={toggleEvening} trackColor={{ true: colors.primary }} thumbColor="#fff" />
      </View>

      <Section icon="📤" title={t('exportData')} subtitle={t('exportCSV')} onPress={handleExport} />
      <Section icon="ℹ️" title={t('aboutTitle')} subtitle={`${t('aboutDescription')}\n\n${t('version')} 1.1.0`} />

      <Text style={[styles.footer, { color: colors.textLight }]}>{language === 'zh' ? '清和 · Qinghe' : 'Qinghe · 清和'}</Text>

      <PremiumModal visible={showPremium} isPremium={premium.isPremium} onClose={() => setShowPremium(false)} onSubscribe={(plan) => { subscribe(plan); }} onRestore={() => Alert.alert('Restored!')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: spacing.lg, marginHorizontal: spacing.md, marginBottom: spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  subSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginHorizontal: spacing.md },
  rowIcon: { fontSize: 24, marginRight: spacing.md },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSub: { fontSize: 13, marginTop: 2 },
  subText: { fontSize: 14 },
  arrow: { fontSize: 22 },
  themeToggle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  themeToggleIcon: { fontSize: 20 },
  footer: { ...typography.bodySmall, textAlign: 'center', marginTop: spacing.xl, letterSpacing: 1 },
});
