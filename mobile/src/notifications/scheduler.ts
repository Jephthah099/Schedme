import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Activity } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RECAP_ID = "schedme-recap-daily";
const DIGEST_ID = "schedme-digest-weekly";

export async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Schedme",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

function activityReminderId(activityId: string) {
  return `schedme-activity-${activityId}`;
}

/** Schedules (or, if the time has already passed today, skips) the pre-block reminder for one activity. */
export async function scheduleActivityReminder(activity: Activity) {
  await cancelActivityReminder(activity.id);

  const [y, m, d] = activity.date.slice(0, 10).split("-").map(Number);
  const fireAt = new Date(y, m - 1, d, 0, 0, 0, 0);
  fireAt.setMinutes(activity.start - activity.remind);

  if (fireAt.getTime() <= Date.now()) return; // don't schedule reminders in the past

  if (!(await requestPermissions())) return;

  await Notifications.scheduleNotificationAsync({
    identifier: activityReminderId(activity.id),
    content: {
      title: `${activity.title} in ${activity.remind} minutes`,
      body: `${activity.place} · ${activity.duration} min`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireAt },
  });
}

export async function cancelActivityReminder(activityId: string) {
  await Notifications.cancelScheduledNotificationAsync(activityReminderId(activityId)).catch(
    () => {}
  );
}

export async function rescheduleAllReminders(activities: Activity[], beforeEnabled: boolean) {
  for (const a of activities) {
    if (!beforeEnabled || a.done) {
      await cancelActivityReminder(a.id);
    } else {
      await scheduleActivityReminder(a);
    }
  }
}

export async function setRecapEnabled(enabled: boolean) {
  await Notifications.cancelScheduledNotificationAsync(RECAP_ID).catch(() => {});
  if (!enabled) return;
  if (!(await requestPermissions())) return;
  await Notifications.scheduleNotificationAsync({
    identifier: RECAP_ID,
    content: {
      title: "End-of-day recap",
      body: "Hours logged, blocks kept, and tomorrow's first block.",
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 21, minute: 30 },
  });
}

export async function setDigestEnabled(enabled: boolean) {
  await Notifications.cancelScheduledNotificationAsync(DIGEST_ID).catch(() => {});
  if (!enabled) return;
  if (!(await requestPermissions())) return;
  await Notifications.scheduleNotificationAsync({
    identifier: DIGEST_ID,
    content: {
      title: "Weekly statistics digest",
      body: "Subject hours and trend for the week.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // Expo convention: 1 = Sunday
      hour: 18,
      minute: 0,
    },
  });
}

export async function sendTestNotification() {
  if (!(await requestPermissions())) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Ward round in 10 minutes",
      body: "Ward 4 · consultant round · 60 min",
    },
    trigger: null,
  });
}

/**
 * Off-schedule nudge: a true background check needs a native background task,
 * which is out of scope here — this is a best-effort foreground-only check.
 * Call this periodically (e.g. every minute) while the app is open.
 */
export function findOverrunningBlock(activities: Activity[], nowMin: number): Activity | null {
  const overrun = activities.find(
    (a) => !a.done && a.start + a.duration + 15 < nowMin && a.start <= nowMin
  );
  return overrun ?? null;
}
