/**
 * Streak calculation utilities.
 * All dates are "YYYY-MM-DD" strings.
 */

/**
 * Calculate current streak walking backwards from today.
 * If today is not checked in, start counting from yesterday.
 */
export function calculateCurrentStreak(checkIns: string[], today: string): number {
  if (checkIns.length === 0) return 0;

  const dateSet = new Set(checkIns);
  let streak = 0;
  const cursor = new Date(today + 'T00:00:00');

  // If today is checked in, count it. Otherwise start from yesterday.
  if (dateSet.has(today)) {
    streak = 1;
  }

  // Walk backwards
  while (true) {
    cursor.setDate(cursor.getDate() - 1);
    const dStr = cursor.toISOString().split('T')[0];
    if (dateSet.has(dStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate the longest consecutive streak in history.
 */
export function calculateLongestStreak(checkIns: string[]): number {
  if (checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const curr = new Date(sorted[i] + 'T00:00:00');
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;

    if (diffDays === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  return Math.max(longest, current);
}

const MILESTONES = [0, 1, 3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365, 500, 1000];

export function getMotivationKey(streak: number): string {
  let key = 'motivation_0';
  for (const m of MILESTONES) {
    if (streak >= m) {
      key = `motivation_${m}`;
    }
  }
  return key;
}
