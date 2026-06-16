import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useLanguage } from '../i18n/LanguageContext';
import { usePremium } from '../hooks/usePremium';
import { useCheckIn } from '../hooks/useCheckIn';
import AppHeader from '../components/AppHeader';
import LanguageSwitch from '../components/LanguageSwitch';
import PremiumModal from '../components/PremiumModal';
import {
  loadReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  scheduleReminder,
  cancelReminder,
} from '../utils/notifications';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { premium, subscribe } = usePremium();
  const { checkIns } = useCheckIn();
  const [showPremium, setShowPremium] = useState(false);
  const [morningReminder, setMorningReminder] = useState(false);
  const [eveningReminder, setEveningReminder] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);

  // Load reminder settings
  React.useEffect(() => {
    loadReminderSettings().then((s) => {
      setMorningReminder(s.morningEnabled);
      setEveningReminder(s.eveningEnabled);
    });
  }, []);

  const toggleMorning = async (val: boolean) => {
    if (val && !premium.isPremium) { setShowPremium(true); return; }
    if (val) {
      const ok = await requestNotificationPermission();
      if (!ok) { Alert.alert('Notification permission required'); return; }
      await scheduleReminder('morning', t('appName'), t('journalMorningHint'), '08:00');
    } else {
      await cancelReminder('morning');
    }
    setMorningReminder(val);
    await saveReminderSettings({
      morningEnabled: val, eveningEnabled: eveningReminder,
      morningTime: '08:00', eveningTime: '21:00',
    });
  };

  const toggleEvening = async (val: boolean) => {
    if (val && !premium.isPremium) { setShowPremium(true); return; }
    if (val) {
      const ok = await requestNotificationPermission();
      if (!ok) { Alert.alert('Notification permission required'); return; }
      await scheduleReminder('evening', t('appName'), t('journalEveningHint'), '21:00');
    } else {
      await cancelReminder('evening');
    }
    setEveningReminder(val);
    await saveReminderSettings({
      morningEnabled: morningReminder, eveningEnabled: val,
      morningTime: '08:00', eveningTime: '21:00',
    });
  };

  const handleExport = async () => {
    if (!premium.isPremium) { setShowPremium(true); return; }
    try {
      const csv = 'date\n' + checkIns.slice(-30).join('\n');
      // Show recent 30 days of data
      Alert.alert(
        t('exportCSV'),
        csv || t('noData'),
        [{ text: t('close') }]
      );
    } catch {
      Alert.alert(t('exportFail'));
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader />

      {/* Premium */}
      <TouchableOpacity style={styles.section} onPress={() => setShowPremium(true)}>
        <Text style={styles.rowIcon}>💎</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('premiumTitle')}</Text>
          <Text style={styles.rowSub}>
            {premium.isPremium ? `✅ ${t('premiumActive')}` : t('premiumDesc')}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.rowIcon}>🌐</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('settingsLanguage')}</Text>
        </View>
        <LanguageSwitch />
      </View>

      {/* Reminders */}
      <View style={styles.section}>
        <Text style={styles.rowIcon}>🔔</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('reminders')}</Text>
          <Text style={styles.rowSub}>{premium.isPremium ? t('premiumActive') : '🔒 ' + t('premium')}</Text>
        </View>
      </View>
      <View style={styles.subSection}>
        <Text style={styles.subText}>{t('reminderMorning')} (08:00)</Text>
        <Switch
          value={morningReminder}
          onValueChange={toggleMorning}
          trackColor={{ true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.subSection}>
        <Text style={styles.subText}>{t('reminderEvening')} (21:00)</Text>
        <Switch
          value={eveningReminder}
          onValueChange={toggleEvening}
          trackColor={{ true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* Privacy Lock */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          if (!premium.isPremium) { setShowPremium(true); return; }
          Alert.alert(
            t('privacyLock'),
            lockEnabled ? t('privacyDisabled') : t('privacyEnable'),
            [
              { text: t('cancel'), style: 'cancel' },
              ...(lockEnabled
                ? [{ text: t('delete'), style: 'destructive' as const, onPress: () => setLockEnabled(false) }]
                : [{ text: t('confirm'), onPress: () => setLockEnabled(true) }]
              ),
            ]
          );
        }}
      >
        <Text style={styles.rowIcon}>🔐</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('privacyLock')}</Text>
          <Text style={styles.rowSub}>
            {lockEnabled ? `✅ ${t('privacyEnable')}` : premium.isPremium ? t('privacyEnable') : '🔒 ' + t('premium')}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Export */}
      <TouchableOpacity style={styles.section} onPress={handleExport}>
        <Text style={styles.rowIcon}>📤</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('exportData')}</Text>
          <Text style={styles.rowSub}>{t('exportCSV')}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.rowIcon}>ℹ️</Text>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{t('aboutTitle')}</Text>
          <Text style={styles.rowSub}>{t('aboutDescription')}</Text>
          <Text style={styles.version}>{t('version')} 1.1.0</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        {language === 'zh' ? '清和 · Qinghe' : 'Qinghe · 清和'}
      </Text>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremium}
        isPremium={premium.isPremium}
        onClose={() => setShowPremium(false)}
        onSubscribe={(plan) => { subscribe(plan); }}
        onRestore={() => Alert.alert('Restored!')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  section: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  subSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    marginTop: -8, marginBottom: spacing.sm,
  },
  rowIcon: { fontSize: 24, marginRight: spacing.md },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  rowSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  subText: { fontSize: 14, color: colors.textPrimary },
  arrow: { fontSize: 22, color: colors.textLight },
  version: { fontSize: 12, color: colors.textLight, marginTop: spacing.sm },
  footer: { ...typography.bodySmall, color: colors.textLight, textAlign: 'center', marginTop: spacing.xl, letterSpacing: 1 },
});
