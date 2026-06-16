import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToday } from '../utils/date';

const CHECKIN_KEY = '@qinghe/checkins';
const CURRENT_VERSION = 1;

export interface CheckInData {
  version: number;
  checkIns: string[]; // sorted "YYYY-MM-DD" strings
  quitDate: string | null;
}

function defaultData(): CheckInData {
  return { version: CURRENT_VERSION, checkIns: [], quitDate: null };
}

export async function loadCheckInData(): Promise<CheckInData> {
  try {
    const raw = await AsyncStorage.getItem(CHECKIN_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    // Basic validation
    if (!Array.isArray(parsed.checkIns)) return defaultData();
    return { ...defaultData(), ...parsed, version: CURRENT_VERSION };
  } catch {
    return defaultData();
  }
}

export async function saveCheckInData(data: CheckInData): Promise<void> {
  await AsyncStorage.setItem(CHECKIN_KEY, JSON.stringify(data));
}

export async function checkInToday(): Promise<CheckInData> {
  const data = await loadCheckInData();
  const today = getToday();
  if (!data.checkIns.includes(today)) {
    data.checkIns.push(today);
    data.checkIns.sort();
    await saveCheckInData(data);
  }
  return data;
}

export async function isTodayCheckedIn(): Promise<boolean> {
  const data = await loadCheckInData();
  return data.checkIns.includes(getToday());
}

export async function setQuitDate(date: string): Promise<void> {
  const data = await loadCheckInData();
  data.quitDate = date;
  await saveCheckInData(data);
}

export async function getAllCheckIns(): Promise<string[]> {
  const data = await loadCheckInData();
  return data.checkIns;
}
