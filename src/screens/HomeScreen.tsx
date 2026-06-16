import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCheckIn } from '../hooks/useCheckIn';
import { useStats } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../components/AppHeader';
import StreakDisplay from '../components/StreakDisplay';
import CheckInButton from '../components/CheckInButton';
import StatsCard from '../components/StatsCard';
import MoneyCounter from '../components/MoneyCounter';
import HealthTimeline from '../components/HealthTimeline';
import AchievementBadge from '../components/AchievementBadge';
import MilestoneModal from '../components/MilestoneModal';
import EmergencyModal from '../components/EmergencyModal';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { checkIns, todayChecked, loading, doCheckIn } = useCheckIn();
  const { currentStreak, longestStreak, totalDays, motivationKey } = useStats(checkIns);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const prevStreak = useRef(currentStreak);

  const { newAchievement, dismissNewAchievement, unlockedAchievements, lockedAchievements, total, unlocked } = useAchievements(currentStreak, totalDays, dailyAmount * totalDays);

  const MILESTONES = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365, 500, 1000];
  useEffect(() => { if (currentStreak > prevStreak.current && MILESTONES.includes(currentStreak)) setShowMilestone(true); prevStreak.current = currentStreak; }, [currentStreak]);
  useEffect(() => { if (newAchievement) setShowAchievementModal(true); }, [newAchievement]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[{ paddingTop: insets.top, backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
        <AppHeader />
        <TouchableOpacity style={[styles.sosBtn, { backgroundColor: colors.sosBg }]} onPress={() => setShowEmergency(true)}>
          <Text style={[styles.sosText, { color: colors.sosText }]}>🆘 {t('emergency')}</Text>
        </TouchableOpacity>
        <StreakDisplay streak={currentStreak} />
        <CheckInButton checkedIn={todayChecked} loading={loading} onCheckIn={doCheckIn} />
        <Text style={[styles.motivation, { color: colors.textSecondary }]}>{t(motivationKey as any)}</Text>
        <View style={styles.statsRow}>
          <StatsCard value={totalDays} label={t('totalDays')} />
          <StatsCard value={longestStreak} label={t('longestStreak')} />
        </View>
        <MoneyCounter totalDays={totalDays} />
        <HealthTimeline currentDays={currentStreak} />
        <View style={styles.achievementSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🏆 {t('achievements')} ({unlocked}/{total})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achScroll}>
            {[...unlockedAchievements, ...lockedAchievements].map((a) => (
              <AchievementBadge key={a.key} icon={a.icon} nameKey={a.nameKey} descKey={a.descKey} unlocked={unlockedAchievements.includes(a)} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {showAchievementModal && newAchievement && (
        <View style={[styles.achToast, { backgroundColor: colors.surface }]}>
          <Text style={styles.achToastIcon}>{newAchievement.icon}</Text>
          <Text style={[styles.achToastTitle, { color: colors.primary }]}>{t('achievementUnlocked')}</Text>
          <Text style={[styles.achToastName, { color: colors.textPrimary }]}>{t(newAchievement.nameKey as any)}</Text>
          <TouchableOpacity onPress={() => { dismissNewAchievement(); setShowAchievementModal(false); }}>
            <Text style={[styles.achToastClose, { color: colors.primary }]}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      )}
      <MilestoneModal streak={currentStreak} visible={showMilestone} onClose={() => setShowMilestone(false)} />
      <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  sosBtn: { alignSelf: 'flex-end', marginRight: spacing.md, marginBottom: -10, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 20 },
  sosText: { fontSize: 13, fontWeight: '600' },
  motivation: { ...typography.bodySmall, textAlign: 'center', fontStyle: 'italic', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  achievementSection: { paddingVertical: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '600', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  achScroll: { paddingHorizontal: spacing.md },
  achToast: { position: 'absolute', bottom: 90, left: spacing.xl, right: spacing.xl, borderRadius: 16, padding: spacing.lg, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 10 },
  achToastIcon: { fontSize: 40 },
  achToastTitle: { fontSize: 14, fontWeight: '600', marginTop: spacing.xs },
  achToastName: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  achToastClose: { fontSize: 14, marginTop: spacing.sm, fontWeight: '500' },
});
