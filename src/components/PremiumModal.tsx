import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  visible: boolean;
  isPremium: boolean;
  onClose: () => void;
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  onRestore: () => void;
}

export default function PremiumModal({ visible, isPremium, onClose, onSubscribe, onRestore }: Props) {
  const { t } = useLanguage();

  const features = [
    { icon: '🔔', key: 'premiumFeature1' },
    { icon: '🆘', key: 'premiumFeature2' },
    { icon: '🔐', key: 'premiumFeature3' },
    { icon: '📤', key: 'premiumFeature4' },
    { icon: '🧘', key: 'premiumFeature5' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.icon}>💎</Text>
            <Text style={styles.title}>{t('premiumTitle')}</Text>
            <Text style={styles.desc}>{t('premiumDesc')}</Text>

            {features.map((f, i) => (
              <View key={i} style={styles.feature}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureText}>{t(f.key as any)}</Text>
              </View>
            ))}

            {isPremium ? (
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>✅ {t('premiumActive')}</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.subBtn} onPress={() => onSubscribe('yearly')}>
                  <Text style={styles.subBtnText}>🎯 {t('premiumYearly')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subBtnOutline} onPress={() => onSubscribe('monthly')}>
                  <Text style={styles.subBtnOutlineText}>{t('premiumMonthly')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onRestore} style={styles.restoreBtn}>
                  <Text style={styles.restoreText}>{t('premiumRestore')}</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.sm },
  closeText: { fontSize: 20, color: colors.textSecondary },
  icon: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  desc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  feature: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  featureIcon: { fontSize: 22, marginRight: spacing.md },
  featureText: { fontSize: 16, color: colors.textPrimary },
  activeBadge: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  activeText: { fontSize: 18, fontWeight: '600', color: colors.primary },
  subBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg },
  subBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  subBtnOutline: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm, borderWidth: 2, borderColor: colors.primary },
  subBtnOutlineText: { color: colors.primary, fontSize: 17, fontWeight: '600' },
  restoreBtn: { alignItems: 'center', marginTop: spacing.md, padding: spacing.sm },
  restoreText: { fontSize: 13, color: colors.textSecondary },
});
