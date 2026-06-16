import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCheckIn } from '../hooks/useCheckIn';
import { useStats } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { useLanguage } from '../i18n/LanguageContext';
import AppHeader from '../components/AppHeader';
import StreakDisplay from '../components/StreakDisplay';
import CheckInButton from '../components/CheckInButton';
import StatsCard from '../components/StatsCard';
import MoneyCounter from '../components/MoneyCounter';
import HealthTimeline from '../components/HealthTimeline';
import AchievementBadge from '../components/AchievementBadge';
import MilestoneModal from '../components/MilestoneModal';
import EmergencyModal from '../components/EmergencyModal';
import { ACHIEVEMENTS, checkNewAchievements } from '../utils/achievements';
import { getCurrentHealthMilestone } from '../utils/healthTimeline';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { checkIns, todayChecked, loading, doCheckIn } = useCheckIn();
  const { currentStreak, longestStreak, totalDays, motivationKey } = useStats(checkIns);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const prevStreak = useRef(currentStreak);

  const moneySaved = dailyAmount * totalDays;
  const { newAchievement, dismissNewAchievement, unlockedAchievements, lockedAchievements, total, unlocked } = useAchievements(currentStreak, totalDays, moneySaved);

  // Show milestone modal when streak changes to a milestone
  const MILESTONES = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365, 500, 1000];
  useEffect(() => {
    if (currentStreak > prevStreak.current && MILESTONES.includes(currentStreak)) {
      setShowMilestone(true);
    }
    prevStreak.current = currentStreak;
  }, [currentStreak]);

  // Show achievement popup
  useEffect(() => {
    if (newAchievement) setShowAchievementModal(true);
  }, [newAchievement]);

  const achievementModal = newAchievement && showAchievementModal;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.content}
      >
        <AppHeader />

        {/* Emergency SOS button */}
        <TouchableOpacity style={styles.sosBtn} onPress={() => setShowEmergency(true)}>
          <Text style={styles.sosText}>🆘 {t('emergency')}</Text>
        </TouchableOpacity>

        <StreakDisplay streak={currentStreak} />
        <CheckInButton checkedIn={todayChecked} loading={loading} onCheckIn={doCheckIn} />
        <Text style={styles.motivation}>{t(motivationKey as any)}</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsCard value={totalDays} label={t('totalDays')} />
          <StatsCard value={longestStreak} label={t('longestStreak')} />
        </View>

        {/* Money Saved */}
        <MoneyCounter totalDays={totalDays} />

        {/* Health Timeline */}
        <HealthTimeline currentDays={currentStreak} />

        {/* Achievements */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>🏆 {t('achievements')} ({unlocked}/{total})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementScroll}>
            {[...unlockedAchievements, ...lockedAchievements].map((a) => (
              <AchievementBadge
                key={a.key}
                icon={a.icon}
                nameKey={a.nameKey}
                descKey={a.descKey}
                unlocked={unlockedAchievements.includes(a)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Achievement unlock toast */}
      {achievementModal && (
        <View style={styles.achToast}>
          <Text style={styles.achToastIcon}>{newAchievement.icon}</Text>
          <Text style={styles.achToastTitle}>{t('achievementUnlocked')}</Text>
          <Text style={styles.achToastName}>{t(newAchievement.nameKey as any)}</Text>
          <TouchableOpacity onPress={() => { dismissNewAchievement(); setShowAchievementModal(false); }}>
            <Text style={styles.achToastClose}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Milestone Modal */}
      <MilestoneModal streak={currentStreak} visible={showMilestone} onClose={() => setShowMilestone(false)} />

      {/* Emergency Modal */}
      <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  sosBtn: {
    alignSelf: 'flex-end', marginRight: spacing.md, marginBottom: -10,
    backgroundColor: colors.error, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  sosText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  motivation: {
    ...typography.bodySmall, color: colors.textSecondary,
    textAlign: 'center', fontStyle: 'italic',
    paddingHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  achievementSection: { paddingVertical: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  achievementScroll: { paddingHorizontal: spacing.md },
  achToast: {
    position: 'absolute', bottom: 90, left: spacing.xl, right: spacing.xl,
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
  },
  achToastIcon: { fontSize: 40 },
  achToastTitle: { fontSize: 14, fontWeight: '600', color: colors.primary, marginTop: spacing.xs },
  achToastName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  achToastClose: { fontSize: 14, color: colors.primary, marginTop: spacing.sm, fontWeight: '500' },
});
