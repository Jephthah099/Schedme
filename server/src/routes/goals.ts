import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { AuthedRequest, requireAuth } from "../middleware/auth";

export const goalsRouter = Router();
goalsRouter.use(requireAuth);

goalsRouter.get("/", async (req: AuthedRequest, res) => {
  const goals = await prisma.subjectGoal.findMany({ where: { userId: req.userId! } });
  res.json(goals);
});

const createSchema = z.object({
  subject: z.string().min(1),
  hoursGoal: z.number().positive(),
});

goalsRouter.post("/", async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const goal = await prisma.subjectGoal.create({
    data: { ...parsed.data, hoursDone: 0, userId: req.userId! },
  });
  res.status(201).json(goal);
});

const patchSchema = z.object({
  subject: z.string().min(1).optional(),
  hoursGoal: z.number().positive().optional(),
  hoursDone: z.number().min(0).optional(),
});

goalsRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const existing = await prisma.subjectGoal.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!existing) {
    return res.status(404).json({ error: "Goal not found" });
  }
  const goal = await prisma.subjectGoal.update({ where: { id: existing.id }, data: parsed.data });
  res.json(goal);
});

goalsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const existing = await prisma.subjectGoal.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!existing) {
    return res.status(404).json({ error: "Goal not found" });
  }
  await prisma.subjectGoal.delete({ where: { id: existing.id } });
  res.status(204).send();
});
