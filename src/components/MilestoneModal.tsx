import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const MILESTONES = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365, 500, 1000];

interface Props {
  streak: number;
  visible: boolean;
  onClose: () => void;
}

export default function MilestoneModal({ streak, visible, onClose }: Props) {
  const { t } = useLanguage();
  const isMilestone = MILESTONES.includes(streak);

  if (!isMilestone) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>{t('milestoneCongrats')}</Text>
          <Text style={styles.streak}>
            {streak} {t('milestoneDay')}
          </Text>
          <Text style={styles.motivation}>{t((`motivation_${streak >= 1000 ? 1000 : streak >= 365 ? 365 : streak >= 200 ? 200 : streak >= 150 ? 150 : streak >= 100 ? 100 : streak >= 75 ? 75 : streak >= 50 ? 50 : streak >= 30 ? 30 : streak >= 21 ? 21 : streak >= 14 ? 14 : streak >= 7 ? 7 : 0}`) as any)}</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  emoji: { fontSize: 64, marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  streak: { fontSize: 48, fontWeight: '800', color: colors.primary, marginBottom: spacing.md },
  motivation: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic', marginBottom: spacing.lg, lineHeight: 22 },
  btn: { backgroundColor: colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 40 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
