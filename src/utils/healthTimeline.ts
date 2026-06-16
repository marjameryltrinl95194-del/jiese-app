export interface HealthMilestone {
  day: number;
  key: string;
}

export const HEALTH_MILESTONES: HealthMilestone[] = [
  { day: 0, key: 'health_0' },
  { day: 1, key: 'health_1' },
  { day: 3, key: 'health_3' },
  { day: 7, key: 'health_7' },
  { day: 14, key: 'health_14' },
  { day: 30, key: 'health_30' },
  { day: 90, key: 'health_90' },
  { day: 365, key: 'health_365' },
];

export function getCurrentHealthMilestone(days: number): HealthMilestone {
  let current = HEALTH_MILESTONES[0];
  for (const m of HEALTH_MILESTONES) {
    if (days >= m.day) current = m;
  }
  return current;
}

export function getNextHealthMilestone(days: number): HealthMilestone | null {
  for (const m of HEALTH_MILESTONES) {
    if (m.day > days) return m;
  }
  return null;
}
