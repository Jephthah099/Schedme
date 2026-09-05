const WEEKDAY_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function toISODate(d: Date): string {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, "0")}-${String(
    c.getDate()
  ).padStart(2, "0")}`;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function startOfWeek(d: Date): Date {
  // Monday-first week, matching the day-strip's Mon..Sun reading order.
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  const dow = c.getDay(); // 0 Sun..6 Sat
  const diff = dow === 0 ? -6 : 1 - dow;
  return addDays(c, diff);
}

export function weekDates(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isoWeekNumber(d: Date): number {
  const c = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = c.getUTCDay() || 7;
  c.setUTCDate(c.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(c.getUTCFullYear(), 0, 1));
  return Math.ceil(((c.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function formatHeaderDate(d: Date): string {
  return `${WEEKDAY_LONG[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]} · Week ${isoWeekNumber(
    d
  )}`;
}

export function weekdayLetter(d: Date): string {
  return WEEKDAY_SHORT[d.getDay()];
}

export function dayCellLabel(d: Date): { dow: string; date: number } {
  return { dow: WEEKDAY_SHORT[d.getDay()] + "", date: d.getDate() };
}

export function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function formatTimeRange(start: number, duration: number): string {
  const end = start + duration;
  return `${minutesToHHMM(start)}–${minutesToHHMM(end)}`;
}

export function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function sameDate(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}
