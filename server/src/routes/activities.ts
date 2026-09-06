import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { addDays, parseDateParam } from "../lib/dates";
import { AuthedRequest, requireAuth } from "../middleware/auth";

export const activitiesRouter = Router();
activitiesRouter.use(requireAuth);

const categoryEnum = z.enum(["Lecture", "Lab", "Clinical", "Study"]);

const createSchema = z.object({
  title: z.string().min(1),
  place: z.string().min(1).default("Added just now"),
  category: categoryEnum,
  date: z.string(), // YYYY-MM-DD
  start: z.number().int().min(0).max(24 * 60),
  duration: z.number().int().min(15).max(240),
  remind: z.number().int().optional(),
});

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  place: z.string().min(1).optional(),
  category: categoryEnum.optional(),
  date: z.string().optional(),
  start: z.number().int().min(0).max(24 * 60).optional(),
  duration: z.number().int().min(15).max(240).optional(),
  done: z.boolean().optional(),
  remind: z.number().int().optional(),
});

// GET /api/activities?date=YYYY-MM-DD  -> single day
// GET /api/activities?from=YYYY-MM-DD&to=YYYY-MM-DD -> range (inclusive), for the weekly chart
activitiesRouter.get("/", async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  if (req.query.from || req.query.to) {
    const from = parseDateParam(req.query.from);
    const to = req.query.to ? parseDateParam(req.query.to) : addDays(from, 6);
    const activities = await prisma.activity.findMany({
      where: { userId, date: { gte: from, lte: addDays(to, 1) } },
      orderBy: { start: "asc" },
    });
    return res.json(activities);
  }
  const date = parseDateParam(req.query.date);
  const activities = await prisma.activity.findMany({
    where: { userId, date },
    orderBy: { start: "asc" },
  });
  res.json(activities);
});

activitiesRouter.post("/", async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { date, ...rest } = parsed.data;
  const activity = await prisma.activity.create({
    data: {
      ...rest,
      date: new Date(date + "T00:00:00"),
      done: false,
      userId: req.userId!,
    },
  });
  res.status(201).json(activity);
});

activitiesRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const existing = await prisma.activity.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!existing) {
    return res.status(404).json({ error: "Activity not found" });
  }
  const { date, ...rest } = parsed.data;
  const activity = await prisma.activity.update({
    where: { id: existing.id },
    data: {
      ...rest,
      ...(date ? { date: new Date(date + "T00:00:00") } : {}),
    },
  });
  res.json(activity);
});
