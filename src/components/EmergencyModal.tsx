import React, { useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ visible, onClose }: Props) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'menu' | 'breathing' | 'distraction'>('menu');
  const [breathingStep, setBreathingStep] = useState<'idle' | 'in' | 'hold' | 'out'>('idle');
  const breathAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);

  const distractions = [
    t('pushupChallenge'), t('coldShower'), t('goForWalk'),
    t('callFriend'), t('meditation'), t('readBook'),
  ];

  const startBreathing = () => {
    setMode('breathing');
    setBreathingStep('in');
    runBreathCycle();
  };

  const runBreathCycle = () => {
    // Inhale
    setBreathingStep('in');
    Animated.timing(breathAnim, { toValue: 1.4, duration: 4000, useNativeDriver: true }).start();
    timerRef.current = setTimeout(() => {
      // Hold
      setBreathingStep('hold');
      timerRef.current = setTimeout(() => {
        // Exhale
        setBreathingStep('out');
        Animated.timing(breathAnim, { toValue: 1, duration: 4000, useNativeDriver: true }).start();
        timerRef.current = setTimeout(() => runBreathCycle(), 4000);
      }, 2000);
    }, 4000);
  };

  const stopBreathing = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    breathAnim.setValue(1);
    setBreathingStep('idle');
    setMode('menu');
  };

  const stepLabel = breathingStep === 'in' ? t('breatheIn') : breathingStep === 'hold' ? t('breatheHold') : t('breatheOut');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🆘 {t('emergencyTitle')}</Text>
          <TouchableOpacity onPress={() => { stopBreathing(); onClose(); }}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        {mode === 'menu' && (
          <View style={styles.menu}>
            <Text style={styles.hint}>{t('emergencyHint')}</Text>

            <TouchableOpacity style={styles.card} onPress={startBreathing}>
              <Text style={styles.cardIcon}>🫁</Text>
              <Text style={styles.cardTitle}>{t('emergencyBreathing')}</Text>
              <Text style={styles.cardDesc}>4-2-4 呼吸法</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => setMode('distraction')}>
              <Text style={styles.cardIcon}>💪</Text>
              <Text style={styles.cardTitle}>{t('emergencyDistraction')}</Text>
              <Text style={styles.cardDesc}>{t('distractionList')}</Text>
            </TouchableOpacity>

            <Text style={styles.quote}>"{t('motivation_0')}"</Text>
          </View>
        )}

        {mode === 'breathing' && (
          <View style={styles.breathingWrap}>
            <Animated.View style={[styles.breathCircle, { transform: [{ scale: breathAnim }] }]}>
              <Text style={styles.breathText}>{stepLabel}</Text>
            </Animated.View>
            <TouchableOpacity style={styles.stopBtn} onPress={stopBreathing}>
              <Text style={styles.stopBtnText}>{t('breatheStop')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'distraction' && (
          <View style={styles.distractionList}>
            {distractions.map((item, i) => (
              <View key={i} style={styles.distractionItem}>
                <Text style={styles.distractionText}>{i + 1}. {item}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.backBtn} onPress={() => setMode('menu')}>
              <Text style={styles.backBtnText}>{t('back')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  closeBtn: { fontSize: 24, color: colors.textSecondary, padding: spacing.sm },
  menu: { padding: spacing.lg, flex: 1, justifyContent: 'center' },
  hint: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 24 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg,
    marginBottom: spacing.md, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardIcon: { fontSize: 40, marginBottom: spacing.sm },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  cardDesc: { fontSize: 13, color: colors.textSecondary },
  quote: { fontSize: 14, fontStyle: 'italic', color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  breathingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  breathCircle: {
    width: 200, height: 200, borderRadius: 100, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl,
  },
  breathText: { fontSize: 24, fontWeight: '700', color: colors.primary },
  stopBtn: { backgroundColor: colors.error, borderRadius: 25, paddingVertical: 14, paddingHorizontal: 40 },
  stopBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  distractionList: { padding: spacing.lg },
  distractionItem: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    marginBottom: spacing.sm, borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  distractionText: { fontSize: 16, color: colors.textPrimary },
  backBtn: { marginTop: spacing.xl, alignItems: 'center' },
  backBtnText: { fontSize: 15, color: colors.primary, fontWeight: '500' },
});
