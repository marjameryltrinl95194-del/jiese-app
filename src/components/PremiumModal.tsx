import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props {
  visible: boolean; isPremium: boolean; onClose: () => void;
  onSubscribe: (plan: 'monthly' | 'yearly') => void; onRestore: () => void;
}

export default function PremiumModal({ visible, isPremium, onClose, onSubscribe, onRestore }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();

  const features = [
    { icon: '🔔', key: 'premiumFeature1' },
    { icon: '🆘', key: 'premiumFeature2' },
    { icon: '🔐', key: 'premiumFeature3' },
    { icon: '📤', key: 'premiumFeature4' },
    { icon: '🧘', key: 'premiumFeature5' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={[styles.closeText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.icon}>💎</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('premiumTitle')}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{t('premiumDesc')}</Text>
            {features.map((f, i) => (
              <View key={i} style={styles.feature}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={[styles.featureText, { color: colors.textPrimary }]}>{t(f.key as any)}</Text>
              </View>
            ))}
            {isPremium ? (
              <View style={[styles.activeBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.activeText, { color: colors.primary }]}>✅ {t('premiumActive')}</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={[styles.subBtn, { backgroundColor: colors.primary }]} onPress={() => onSubscribe('yearly')}>
                  <Text style={styles.subBtnText}>🎯 {t('premiumYearly')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subBtnOutline, { borderColor: colors.primary }]} onPress={() => onSubscribe('monthly')}>
                  <Text style={[styles.subBtnOutlineText, { color: colors.primary }]}>{t('premiumMonthly')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onRestore} style={styles.restoreBtn}>
                  <Text style={[styles.restoreText, { color: colors.textSecondary }]}>{t('premiumRestore')}</Text>
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
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '85%' },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.sm },
  closeText: { fontSize: 20 },
  icon: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: spacing.xs },
  desc: { fontSize: 14, textAlign: 'center', marginBottom: spacing.lg },
  feature: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  featureIcon: { fontSize: 22, marginRight: spacing.md },
  featureText: { fontSize: 16 },
  activeBadge: { borderRadius: 12, padding: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  activeText: { fontSize: 18, fontWeight: '600' },
  subBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg },
  subBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  subBtnOutline: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm, borderWidth: 2 },
  subBtnOutlineText: { fontSize: 17, fontWeight: '600' },
  restoreBtn: { alignItems: 'center', marginTop: spacing.md, padding: spacing.sm },
  restoreText: { fontSize: 13 },
});
