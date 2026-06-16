export interface Achievement {
  key: string;
  nameKey: string;
  descKey: string;
  icon: string;
  check: (streak: number, totalDays: number, moneySaved: number) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    key: 'starter',
    nameKey: 'ach_starter',
    descKey: 'ach_starter_desc',
    icon: '🌱',
    check: (_, totalDays) => totalDays >= 1,
  },
  {
    key: 'week',
    nameKey: 'ach_week',
    descKey: 'ach_week_desc',
    icon: '🔥',
    check: (streak) => streak >= 7,
  },
  {
    key: 'streak7',
    nameKey: 'ach_streak7',
    descKey: 'ach_streak7_desc',
    icon: '⭐',
    check: (streak) => streak >= 7,
  },
  {
    key: 'month',
    nameKey: 'ach_month',
    descKey: 'ach_month_desc',
    icon: '🌟',
    check: (streak) => streak >= 30,
  },
  {
    key: 'streak30',
    nameKey: 'ach_streak30',
    descKey: 'ach_streak30_desc',
    icon: '💫',
    check: (streak) => streak >= 30,
  },
  {
    key: 'quarter',
    nameKey: 'ach_quarter',
    descKey: 'ach_quarter_desc',
    icon: '🏆',
    check: (streak) => streak >= 90,
  },
  {
    key: 'halfYear',
    nameKey: 'ach_halfYear',
    descKey: 'ach_halfYear_desc',
    icon: '👑',
    check: (streak) => streak >= 180,
  },
  {
    key: 'year',
    nameKey: 'ach_year',
    descKey: 'ach_year_desc',
    icon: '💎',
    check: (streak) => streak >= 365,
  },
  {
    key: 'money',
    nameKey: 'ach_money',
    descKey: 'ach_money_desc',
    icon: '💰',
    check: (_, __, money) => money >= 1000,
  },
];

export function checkNewAchievements(
  streak: number,
  totalDays: number,
  moneySaved: number,
  unlocked: string[],
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !unlocked.includes(a.key) && a.check(streak, totalDays, moneySaved));
}
