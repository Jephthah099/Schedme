import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { addDays } from "../lib/dates";

export const profileRouter = Router();
profileRouter.use(requireAuth);

profileRouter.get("/", async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const doneActivities = await prisma.activity.findMany({
    where: { userId: req.userId!, done: true },
  });
  const hoursLogged = Math.round(doneActivities.reduce((sum, a) => sum + a.duration, 0) / 60);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const signupDay = new Date(user.createdAt);
  signupDay.setHours(0, 0, 0, 0);
  const elapsedDays = Math.max(1, Math.round((today.getTime() - signupDay.getTime()) / 86_400_000) + 1);

  const doneMinutesByDate = new Map<string, number>();
  for (const a of doneActivities) {
    const key = a.date.toISOString().slice(0, 10);
    doneMinutesByDate.set(key, (doneMinutesByDate.get(key) ?? 0) + a.duration);
  }
  const targetMinutes = user.dailyTargetH * 60;

  let keptCount = 0;
  let bestStreak = 0;
  let running = 0;
  for (let i = 0; i < elapsedDays; i++) {
    const key = addDays(signupDay, i).toISOString().slice(0, 10);
    const kept = (doneMinutesByDate.get(key) ?? 0) >= targetMinutes;
    if (kept) {
      keptCount++;
      running++;
      bestStreak = Math.max(bestStreak, running);
    } else {
      running = 0;
    }
  }
  const planKeptPct = Math.round((keptCount / elapsedDays) * 100);

  res.json({
    id: user.id,
    name: user.name,
    subtitle: user.subtitle,
    dailyTargetH: user.dailyTargetH,
    hoursLogged,
    planKeptPct,
    bestStreak,
  });
});

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  dailyTargetH: z.number().positive().optional(),
});

profileRouter.patch("/", async (req: AuthedRequest, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const user = await prisma.user.update({ where: { id: req.userId! }, data: parsed.data });
  res.json({ id: user.id, name: user.name, subtitle: user.subtitle, dailyTargetH: user.dailyTargetH });
});
