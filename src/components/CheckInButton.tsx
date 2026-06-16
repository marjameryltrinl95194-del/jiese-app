import React, { useRef } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet,
  Animated, Alert, ActivityIndicator,
} from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface Props {
  checkedIn: boolean;
  loading: boolean;
  onCheckIn: () => void;
}

export default function CheckInButton({ checkedIn, loading, onCheckIn }: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    animatePress();
    if (checkedIn) {
      Alert.alert(t('alreadyCheckedIn'), t('alreadyCheckedInMsg'));
      return;
    }
    Alert.alert(t('confirmTitle'), t('confirmCheckIn'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('confirm'), onPress: onCheckIn },
    ]);
  };

  const ringColor = checkedIn ? colors.primaryDark : colors.primary;
  const bgColor = checkedIn ? colors.primaryDark : colors.primary;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[
        styles.buttonOuter,
        {
          transform: [{ scale: scaleAnim }],
          backgroundColor: colors.primaryLight,
          shadowColor: colors.primary,
        },
      ]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: bgColor }]}
          onPress={handlePress}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.checkmark}>{checkedIn ? '✓' : '○'}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.label, { color: ringColor }]}>
        {checkedIn ? t('checkedIn') : t('checkIn')}
      </Text>
    </View>
  );
}

const BUTTON_SIZE = 140;

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingVertical: spacing.lg },
  buttonOuter: {
    width: BUTTON_SIZE, height: BUTTON_SIZE, borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  button: {
    width: BUTTON_SIZE - 16, height: BUTTON_SIZE - 16,
    borderRadius: (BUTTON_SIZE - 16) / 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkmark: { fontSize: 48, color: '#fff', fontWeight: '300' },
  label: { marginTop: spacing.md, fontSize: 18, fontWeight: '600' },
});
