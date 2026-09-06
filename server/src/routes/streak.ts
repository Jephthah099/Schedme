import { Router } from "express";
import { prisma } from "../prisma";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { addDays } from "../lib/dates";

export const streakRouter = Router();
streakRouter.use(requireAuth);

const WINDOW_DAYS = 14;

streakRouter.get("/", async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = addDays(today, -(WINDOW_DAYS - 1));

  const activities = await prisma.activity.findMany({
    where: { userId: req.userId!, done: true, date: { gte: from, lte: today } },
  });

  const doneMinutesByDate = new Map<string, number>();
  for (const a of activities) {
    const key = a.date.toISOString().slice(0, 10);
    doneMinutesByDate.set(key, (doneMinutesByDate.get(key) ?? 0) + a.duration);
  }

  const targetMinutes = user.dailyTargetH * 60;
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = addDays(from, i);
    const key = date.toISOString().slice(0, 10);
    const kept = (doneMinutesByDate.get(key) ?? 0) >= targetMinutes;
    return { id: key, date, kept };
  });

  let current = 0;
  const todayKey = today.toISOString().slice(0, 10);
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].kept) {
      current++;
    } else if (days[i].id === todayKey && current === 0) {
      continue; // today isn't over yet — don't break the streak on an in-progress day
    } else {
      break;
    }
  }

  res.json({ days, current });
});
