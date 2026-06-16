import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@qinghe/premium';

export interface PremiumData {
  isPremium: boolean;
  plan: 'none' | 'monthly' | 'yearly';
  expireDate: string | null;
}

export async function loadPremium(): Promise<PremiumData> {
  try {
    const raw = await AsyncStorage.getItem(PREMIUM_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      // Check expiration
      if (p.expireDate && new Date(p.expireDate) < new Date()) {
        return { isPremium: false, plan: 'none', expireDate: null };
      }
      return p;
    }
  } catch {}
  return { isPremium: false, plan: 'none', expireDate: null };
}

export async function setPremium(plan: 'monthly' | 'yearly'): Promise<PremiumData> {
  const now = new Date();
  const months = plan === 'yearly' ? 12 : 1;
  now.setMonth(now.getMonth() + months);
  const data: PremiumData = {
    isPremium: true,
    plan,
    expireDate: now.toISOString(),
  };
  await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
  return data;
}

export async function clearPremium(): Promise<void> {
  await AsyncStorage.setItem(
    PREMIUM_KEY,
    JSON.stringify({ isPremium: false, plan: 'none', expireDate: null }),
  );
}
