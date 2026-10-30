// Weeks run Monday–Sunday and are numbered by ISO 8601, like the paper sheet.
// Dates are handled as local calendar days: toISOString() would shift them to UTC.

export function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

export function mondayOf(d: Date): Date {
  return addDays(d, -((d.getDay() + 6) % 7));
}

export function isoWeekNumber(d: Date): number {
  const thursday = addDays(mondayOf(d), 3);
  const firstThursday = addDays(mondayOf(new Date(thursday.getFullYear(), 0, 4)), 3);
  return 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
}
