import { Activity } from "../types";
import { toISODate, weekDates } from "./time";

// All values here are derived on the fly from activities — never stored,
// per the handoff's "State Management: Derived, never stored" note.

export function activitiesOnDate(activities: Activity[], date: Date): Activity[] {
  const iso = toISODate(date);
  return activities.filter((a) => a.date.slice(0, 10) === iso);
}

export function hoursOf(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + a.duration, 0) / 60;
}

export function doneHoursOf(activities: Activity[]): number {
  return activities.filter((a) => a.done).reduce((sum, a) => sum + a.duration, 0) / 60;
}

export interface HeroStats {
  doneHours: number;
  plannedHours: number;
  targetHours: number;
  pct: number; // 0-1, clamped
  footerLeft: string;
  footerRight: string;
}

export function heroStats(today: Activity[], targetHours: number): HeroStats {
  const doneHours = doneHoursOf(today);
  const plannedHours = hoursOf(today);
  const pct = targetHours > 0 ? Math.min(1, doneHours / targetHours) : 0;
  const remaining = Math.max(0, targetHours - doneHours);
  const footerLeft = remaining <= 0.05 ? "Target met" : `${round1(remaining)} h to target`;
  const footerRight = `${round1(plannedHours)} h planned`;
  return { doneHours, plannedHours, targetHours, pct, footerLeft, footerRight };
}

export function blocksCompleted(today: Activity[]): { done: number; total: number; label: string } {
  const done = today.filter((a) => a.done).length;
  return { done, total: today.length, label: `${done} / ${today.length}` };
}

export function plannedVsActualPct(week: Activity[]): number {
  const planned = hoursOf(week);
  const actual = doneHoursOf(week);
  if (planned <= 0) return 0;
  return Math.round((actual / planned) * 100);
}

export interface DayBar {
  date: Date;
  iso: string;
  letter: string;
  planned: number; // hours
  actual: number; // hours
  isToday: boolean;
}

export function hoursPerDay(activities: Activity[], anchor: Date): DayBar[] {
  const days = weekDates(anchor);
  const todayIso = toISODate(new Date());
  return days.map((d) => {
    const onDay = activitiesOnDate(activities, d);
    return {
      date: d,
      iso: toISODate(d),
      letter: "SMTWTFS"[d.getDay()],
      planned: hoursOf(onDay),
      actual: doneHoursOf(onDay),
      isToday: toISODate(d) === todayIso,
    };
  });
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
