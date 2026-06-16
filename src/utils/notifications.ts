import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_KEY = '@qinghe/reminders';

export interface ReminderSettings {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningTime: string; // "HH:MM"
  eveningTime: string; // "HH:MM"
}

const DEFAULT_REMINDERS: ReminderSettings = {
  morningEnabled: false,
  eveningEnabled: false,
  morningTime: '08:00',
  eveningTime: '21:00',
};

export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY);
    if (raw) return { ...DEFAULT_REMINDERS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_REMINDERS;
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminder(id: string, title: string, body: string, timeStr: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);

  const [h, m] = timeStr.split(':').map(Number);
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: h,
      minute: m,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function cancelReminder(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
