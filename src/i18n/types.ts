export type Language = 'zh' | 'en';

export interface TranslationMap {
  // App
  appName: string;
  appSubtitle: string;

  // Tabs
  tabHome: string;
  tabHistory: string;
  tabJournal: string;
  tabSettings: string;

  // Check-in
  checkIn: string;
  checkedIn: string;
  alreadyCheckedIn: string;
  alreadyCheckedInMsg: string;
  confirmTitle: string;
  confirmCheckIn: string;
  confirm: string;
  cancel: string;

  // Stats
  currentStreak: string;
  totalDays: string;
  longestStreak: string;
  days: string;
  day: string;
  totalCheckIns: string;
  monthSummary: string;
  checkInRate: string;
  weeklyReport: string;
  monthlyReport: string;

  // Motivations
  motivation_0: string;
  motivation_1: string;
  motivation_3: string;
  motivation_7: string;
  motivation_14: string;
  motivation_21: string;
  motivation_30: string;
  motivation_50: string;
  motivation_75: string;
  motivation_100: string;
  motivation_150: string;
  motivation_200: string;
  motivation_365: string;
  motivation_500: string;
  motivation_1000: string;

  // Money
  moneySaved: string;
  moneyTotal: string;
  moneyPerDay: string;
  moneySetDaily: string;
  moneyCurrency: string;
  moneyEditHint: string;

  // Health Timeline
  healthTimeline: string;
  healthDay: string;
  health_0: string;
  health_1: string;
  health_3: string;
  health_7: string;
  health_14: string;
  health_30: string;
  health_90: string;
  health_365: string;

  // Achievements
  achievements: string;
  achievementUnlocked: string;
  ach_starter: string;
  ach_starter_desc: string;
  ach_week: string;
  ach_week_desc: string;
  ach_month: string;
  ach_month_desc: string;
  ach_quarter: string;
  ach_quarter_desc: string;
  ach_halfYear: string;
  ach_halfYear_desc: string;
  ach_year: string;
  ach_year_desc: string;
  ach_money: string;
  ach_money_desc: string;
  ach_streak7: string;
  ach_streak7_desc: string;
  ach_streak30: string;
  ach_streak30_desc: string;

  // Journal
  journal: string;
  journalMorning: string;
  journalEvening: string;
  journalMorningHint: string;
  journalEveningHint: string;
  journalSave: string;
  journalSaved: string;
  journalEmpty: string;
  journalEmptyHint: string;
  journalFeeling: string;
  feeling_great: string;
  feeling_good: string;
  feeling_ok: string;
  feeling_bad: string;
  feeling_terrible: string;

  // Emergency
  emergency: string;
  emergencyTitle: string;
  emergencyHint: string;
  emergencyBreathing: string;
  emergencyDistraction: string;
  emergencyMotivation: string;
  breatheIn: string;
  breatheOut: string;
  breatheHold: string;
  breatheStart: string;
  breatheStop: string;
  distractionList: string;
  pushupChallenge: string;
  coldShower: string;
  goForWalk: string;
  callFriend: string;
  meditation: string;
  readBook: string;

  // Milestone
  milestoneCongrats: string;
  milestoneDay: string;
  milestoneShare: string;

  // Charts
  chartCheckInTrend: string;
  chartWeeklyStats: string;
  chartNoData: string;

  // Premium
  premium: string;
  premiumTitle: string;
  premiumDesc: string;
  premiumFeature1: string;
  premiumFeature2: string;
  premiumFeature3: string;
  premiumFeature4: string;
  premiumFeature5: string;
  premiumSubscribe: string;
  premiumRestore: string;
  premiumActive: string;
  premiumMonthly: string;
  premiumYearly: string;
  free: string;

  // Reminders
  reminders: string;
  reminderMorning: string;
  reminderEvening: string;
  reminderEnabled: string;
  reminderDisabled: string;
  reminderSetTime: string;

  // Privacy
  privacy: string;
  privacyLock: string;
  privacyEnable: string;
  privacySetPasscode: string;
  privacyEnterPasscode: string;
  privacyWrongPasscode: string;
  privacyDisabled: string;

  // Export
  exportData: string;
  exportCSV: string;
  exportSuccess: string;
  exportFail: string;

  // Settings
  settingsLanguage: string;
  languageChinese: string;
  languageEnglish: string;
  aboutTitle: string;
  aboutDescription: string;
  version: string;

  // Calendar & General
  emptyHistory: string;
  emptyHistoryHint: string;
  noData: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;

  // Misc
  today: string;
  yesterday: string;
  close: string;
  back: string;
  save: string;
  edit: string;
  delete: string;
  share: string;
  restore: string;
  loading: string;
  retry: string;
  success: string;
  fail: string;
}
