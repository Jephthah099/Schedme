import { create } from "zustand";
import { api } from "../api/client";
import {
  Activity,
  ActivityForm,
  Category,
  Deadline,
  DayLog,
  NotificationToggle,
  ProfileInfo,
  SubjectGoal,
  ToggleKey,
} from "../types";
import { hhmmToMinutes, minutesToHHMM, toISODate, weekDates } from "../lib/time";
import {
  cancelActivityReminder,
  rescheduleAllReminders,
  scheduleActivityReminder,
  setDigestEnabled,
  setRecapEnabled,
} from "../notifications/scheduler";

const GRID_START = 6 * 60; // 06:00
const GRID_END = 22 * 60; // 22:00

const defaultForm: ActivityForm = {
  title: "",
  category: "Study",
  start: "14:00",
  duration: 60,
  remind: 10,
};

let bannerTimer: ReturnType<typeof setTimeout> | null = null;

interface AppState {
  activities: Activity[];
  goals: SubjectGoal[];
  deadlines: Deadline[];
  streak: { days: DayLog[]; current: number };
  toggles: NotificationToggle[];
  profile: ProfileInfo | null;

  day: string; // selected day-strip date, ISO
  dragId: string | null;
  form: ActivityForm;
  banner: string | null;

  loading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  setDay: (iso: string) => void;
  toggleDone: (id: string) => Promise<void>;
  rescheduleActivity: (id: string, newStart: number) => Promise<void>;
  addActivity: () => Promise<Activity>;
  setForm: (patch: Partial<ActivityForm>) => void;
  resetForm: () => void;
  toggle: (key: ToggleKey, enabled: boolean) => Promise<void>;
  addGoal: (subject: string, hoursGoal: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addDeadline: (title: string, subtitle: string, dueDate: string) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  updateProfile: (patch: Partial<Pick<ProfileInfo, "name" | "subtitle" | "dailyTargetH">>) => Promise<void>;
  showBanner: (msg: string) => void;
  dismissBanner: () => void;
  setDragId: (id: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activities: [],
  goals: [],
  deadlines: [],
  streak: { days: [], current: 0 },
  toggles: [],
  profile: null,

  day: toISODate(new Date()),
  dragId: null,
  form: defaultForm,
  banner: null,

  loading: true,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const week = weekDates(new Date());
      const from = toISODate(week[0]);
      const to = toISODate(week[6]);
      const [activities, goals, deadlines, streak, toggles, profile] = await Promise.all([
        api.get<Activity[]>(`/api/activities?from=${from}&to=${to}`),
        api.get<SubjectGoal[]>("/api/goals"),
        api.get<Deadline[]>("/api/deadlines"),
        api.get<{ days: DayLog[]; current: number }>("/api/streak"),
        api.get<NotificationToggle[]>("/api/toggles"),
        api.get<ProfileInfo>("/api/profile"),
      ]);
      set({ activities, goals, deadlines, streak, toggles, profile, loading: false });

      const beforeEnabled = toggles.find((t) => t.key === "before")?.enabled ?? true;
      const recapEnabled = toggles.find((t) => t.key === "recap")?.enabled ?? false;
      const digestEnabled = toggles.find((t) => t.key === "digest")?.enabled ?? false;
      await rescheduleAllReminders(activities, beforeEnabled);
      await setRecapEnabled(recapEnabled);
      await setDigestEnabled(digestEnabled);
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? "Failed to load" });
    }
  },

  setDay: (iso) => set({ day: iso }),

  toggleDone: async (id) => {
    const prev = get().activities;
    const target = prev.find((a) => a.id === id);
    if (!target) return;
    const nextDone = !target.done;
    set({ activities: prev.map((a) => (a.id === id ? { ...a, done: nextDone } : a)) });
    try {
      const updated = await api.patch<Activity>(`/api/activities/${id}`, { done: nextDone });
      set({ activities: get().activities.map((a) => (a.id === id ? updated : a)) });
      const beforeEnabled = get().toggles.find((t) => t.key === "before")?.enabled ?? true;
      if (nextDone) await cancelActivityReminder(id);
      else if (beforeEnabled) await scheduleActivityReminder(updated);
    } catch (e: any) {
      set({ activities: prev, error: e?.message ?? "Couldn't save that change." });
    }
  },

  rescheduleActivity: async (id, newStart) => {
    const prev = get().activities;
    const target = prev.find((a) => a.id === id);
    if (!target) return;
    const clamped = Math.max(GRID_START, Math.min(newStart, GRID_END - target.duration));
    set({
      activities: prev.map((a) => (a.id === id ? { ...a, start: clamped } : a)),
    });
    try {
      const updated = await api.patch<Activity>(`/api/activities/${id}`, { start: clamped });
      set({ activities: get().activities.map((a) => (a.id === id ? updated : a)) });
      const beforeEnabled = get().toggles.find((t) => t.key === "before")?.enabled ?? true;
      if (beforeEnabled && !updated.done) await scheduleActivityReminder(updated);
      get().showBanner(
        `${updated.title} moved to ${minutesToHHMM(updated.start)} — reminder set for ${minutesToHHMM(
          Math.max(0, updated.start - updated.remind)
        )}.`
      );
    } catch (e: any) {
      set({ activities: prev, error: e?.message ?? "Couldn't reschedule that block." });
    }
  },

  addActivity: async () => {
    const { form } = get();
    const title = form.title.trim() || `${form.category} block`;
    const start = Math.max(GRID_START, Math.min(hhmmToMinutes(form.start), GRID_END - form.duration));
    const today = toISODate(new Date());
    const created = await api.post<Activity>("/api/activities", {
      title,
      place: "Added just now",
      category: form.category as Category,
      date: today,
      start,
      duration: form.duration,
      remind: form.remind,
    });
    set({ activities: [...get().activities, created], day: today });
    const beforeEnabled = get().toggles.find((t) => t.key === "before")?.enabled ?? true;
    if (beforeEnabled) await scheduleActivityReminder(created);
    get().showBanner(
      `${created.title} added at ${minutesToHHMM(created.start)} — reminder ${created.remind} min before.`
    );
    get().resetForm();
    return created;
  },

  setForm: (patch) => set({ form: { ...get().form, ...patch } }),
  resetForm: () => set({ form: defaultForm }),

  toggle: async (key, enabled) => {
    const prev = get().toggles;
    set({ toggles: prev.map((t) => (t.key === key ? { ...t, enabled } : t)) });
    try {
      await api.patch(`/api/toggles/${key}`, { enabled });
      if (key === "before") await rescheduleAllReminders(get().activities, enabled);
      if (key === "recap") await setRecapEnabled(enabled);
      if (key === "digest") await setDigestEnabled(enabled);
      const label = {
        before: "Pre-block reminders",
        drift: "Off-schedule nudge",
        recap: "End-of-day recap",
        digest: "Weekly statistics digest",
      }[key];
      get().showBanner(`${label} ${enabled ? "on" : "off"}.`);
    } catch (e: any) {
      set({ toggles: prev, error: e?.message ?? "Couldn't save that setting." });
    }
  },

  addGoal: async (subject, hoursGoal) => {
    const created = await api.post<SubjectGoal>("/api/goals", { subject, hoursGoal });
    set({ goals: [...get().goals, created] });
  },
  deleteGoal: async (id) => {
    const prev = get().goals;
    set({ goals: prev.filter((g) => g.id !== id) });
    try {
      await api.del(`/api/goals/${id}`);
    } catch (e: any) {
      set({ goals: prev, error: e?.message ?? "Couldn't delete that goal." });
    }
  },

  addDeadline: async (title, subtitle, dueDate) => {
    const created = await api.post<Deadline>("/api/deadlines", { title, subtitle, dueDate });
    set({ deadlines: [...get().deadlines, created].sort((a, b) => a.dueDate.localeCompare(b.dueDate)) });
  },
  deleteDeadline: async (id) => {
    const prev = get().deadlines;
    set({ deadlines: prev.filter((d) => d.id !== id) });
    try {
      await api.del(`/api/deadlines/${id}`);
    } catch (e: any) {
      set({ deadlines: prev, error: e?.message ?? "Couldn't delete that deadline." });
    }
  },

  updateProfile: async (patch) => {
    const prev = get().profile;
    if (!prev) return;
    set({ profile: { ...prev, ...patch } });
    try {
      const updated = await api.patch<Pick<ProfileInfo, "id" | "name" | "subtitle" | "dailyTargetH">>(
        "/api/profile",
        patch
      );
      set({ profile: { ...get().profile!, ...updated } });
    } catch (e: any) {
      set({ profile: prev, error: e?.message ?? "Couldn't save that change." });
    }
  },

  showBanner: (msg) => {
    if (bannerTimer) clearTimeout(bannerTimer);
    set({ banner: msg });
    bannerTimer = setTimeout(() => set({ banner: null }), 3600);
  },
  dismissBanner: () => {
    if (bannerTimer) clearTimeout(bannerTimer);
    set({ banner: null });
  },

  setDragId: (id) => set({ dragId: id }),

  reset: () => {
    if (bannerTimer) clearTimeout(bannerTimer);
    set({
      activities: [],
      goals: [],
      deadlines: [],
      streak: { days: [], current: 0 },
      toggles: [],
      profile: null,
      day: toISODate(new Date()),
      dragId: null,
      form: defaultForm,
      banner: null,
      loading: true,
      error: null,
    });
  },
}));
