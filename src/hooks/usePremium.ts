import { useState, useEffect, useCallback } from 'react';
import { loadPremium, setPremium, clearPremium, PremiumData } from '../storage/premiumStorage';

export function usePremium() {
  const [premium, setPremiumState] = useState<PremiumData>({
    isPremium: false,
    plan: 'none',
    expireDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremium().then((p) => {
      setPremiumState(p);
      setLoading(false);
    });
  }, []);

  const subscribe = useCallback(async (plan: 'monthly' | 'yearly') => {
    const p = await setPremium(plan);
    setPremiumState(p);
  }, []);

  const unsubscribe = useCallback(async () => {
    await clearPremium();
    setPremiumState({ isPremium: false, plan: 'none', expireDate: null });
  }, []);

  return { premium, loading, subscribe, unsubscribe };
}
