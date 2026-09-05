export type Category = "Lecture" | "Lab" | "Clinical" | "Study";

export interface Activity {
  id: string;
  title: string;
  place: string;
  category: Category;
  date: string; // ISO date string (day-level)
  start: number; // minutes from midnight
  duration: number; // minutes
  done: boolean;
  remind: number; // minutes before start
}

export interface SubjectGoal {
  id: string;
  subject: string;
  hoursGoal: number;
  hoursDone: number;
}

export interface Deadline {
  id: string;
  title: string;
  subtitle: string;
  dueDate: string;
  daysLeft: number;
}

export interface DayLog {
  id: string;
  date: string;
  kept: boolean;
}

export type ToggleKey = "before" | "drift" | "recap" | "digest";

export interface NotificationToggle {
  id: string;
  key: ToggleKey;
  enabled: boolean;
}

export interface ProfileInfo {
  id: string;
  name: string;
  subtitle: string;
  hoursLogged: number;
  planKeptPct: number;
  bestStreak: number;
  dailyTargetH: number;
}

export interface ActivityForm {
  title: string;
  category: Category;
  start: string; // "HH:MM"
  duration: number; // minutes
  remind: 5 | 10 | 30;
}
