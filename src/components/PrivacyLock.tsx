import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const PASSCODE_KEY = '@qinghe/passcode';
const LOCK_KEY = '@qinghe/lockEnabled';

interface Props {
  onUnlock: () => void;
}

export function PrivacyLock({ onUnlock }: Props) {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [input, setInput] = useState('');
  const [settingUp, setSettingUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(LOCK_KEY),
      AsyncStorage.getItem(PASSCODE_KEY),
    ]).then(([lockVal, codeVal]) => {
      if (lockVal === 'true' && codeVal) {
        setEnabled(true);
        setPasscode(codeVal);
      }
    });
  }, []);

  const handleInput = (num: string) => {
    const newInput = (input + num).slice(0, 4);
    setInput(newInput);
    setError('');

    if (newInput.length === 4) {
      if (settingUp) {
        setPasscode(newInput);
        Promise.all([
          AsyncStorage.setItem(PASSCODE_KEY, newInput),
          AsyncStorage.setItem(LOCK_KEY, 'true'),
        ]);
        setSettingUp(false);
        setEnabled(true);
        setInput('');
        onUnlock();
      } else if (newInput === passcode) {
        setInput('');
        onUnlock();
      } else {
        setError(t('privacyWrongPasscode'));
        setTimeout(() => { setInput(''); setError(''); }, 1000);
      }
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const enableLock = () => {
    setSettingUp(true);
    setInput('');
    setError('');
  };

  const disableLock = () => {
    setEnabled(false);
    setPasscode('');
    AsyncStorage.removeItem(LOCK_KEY);
    AsyncStorage.removeItem(PASSCODE_KEY);
  };

  if (!enabled) return null;

  return (
    <Modal visible animationType="fade">
      <View style={styles.container}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>
          {settingUp ? t('privacySetPasscode') : t('privacyEnterPasscode')}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, input.length > i && styles.dotFilled]} />
          ))}
        </View>
        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0, '⌫'].map((key, i) => (
            <TouchableOpacity
              key={i}
              style={styles.key}
              onPress={() => {
                if (key === '⌫') handleDelete();
                else if (key !== ' ') handleInput(String(key));
              }}
              disabled={key === ' '}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

// Export a hook for enabling/disabling
export function usePrivacyLock() {
  const [locked, setLocked] = useState(false);
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LOCK_KEY).then((val) => {
      if (val === 'true') setLocked(true);
    });
  }, []);

  const lock = () => setShowLock(true);
  const unlock = () => { setShowLock(false); setLocked(true); };
  const enableLock = async () => {
    await AsyncStorage.setItem(LOCK_KEY, 'true');
    setLocked(true);
  };
  const disableLock = async () => {
    await AsyncStorage.removeItem(LOCK_KEY);
    await AsyncStorage.removeItem(PASSCODE_KEY);
    setLocked(false);
    setShowLock(false);
  };

  return { locked, showLock, lock, unlock, enableLock, disableLock };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  icon: { fontSize: 48, marginBottom: spacing.lg },
  title: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xl },
  error: { fontSize: 14, color: colors.error, marginBottom: spacing.md },
  dots: { flexDirection: 'row', marginBottom: spacing.xl },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border, marginHorizontal: 8 },
  dotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 280, justifyContent: 'center' },
  key: { width: 72, height: 56, justifyContent: 'center', alignItems: 'center', margin: 6, borderRadius: 12, backgroundColor: colors.surface },
  keyText: { fontSize: 24, color: colors.textPrimary },
});
