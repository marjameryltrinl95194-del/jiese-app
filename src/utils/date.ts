/**
 * Local-date helpers. All functions use the device-local timezone.
 * We store dates as "YYYY-MM-DD" strings to avoid timezone bugs.
 */

export function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDisplayDate(dateStr: string, lang: 'zh' | 'en'): string {
  const d = new Date(dateStr + 'T00:00:00');
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();

  if (lang === 'zh') {
    return `${y}年${m}月${day}日`;
  }
  // English
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[d.getMonth()]} ${day}, ${y}`;
}

export function formatMonthYear(year: number, month: number, lang: 'zh' | 'en'): string {
  if (lang === 'zh') {
    return `${year}年${month}月`;
  }
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[month - 1]} ${year}`;
}

export function getDaysInMonth(year: number, month: number): number {
  // month is 1-indexed
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  // Returns 0=Sun ... 6=Sat
  return new Date(year, month - 1, 1).getDay();
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}

export function isFutureDate(dateStr: string): boolean {
  return dateStr > getToday();
}

export function addMonths(year: number, month: number, delta: number): [number, number] {
  const totalMonths = year * 12 + month - 1 + delta;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;
  return [newYear, newMonth];
}

export function dateToStr(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}
