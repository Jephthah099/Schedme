import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { AuthedRequest, requireAuth } from "../middleware/auth";

export const deadlinesRouter = Router();
deadlinesRouter.use(requireAuth);

deadlinesRouter.get("/", async (req: AuthedRequest, res) => {
  const deadlines = await prisma.deadline.findMany({
    where: { userId: req.userId! },
    orderBy: { dueDate: "asc" },
  });
  const now = Date.now();
  res.json(
    deadlines.map((d) => ({
      ...d,
      daysLeft: Math.max(0, Math.ceil((d.dueDate.getTime() - now) / 86_400_000)),
    }))
  );
});

const createSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1).default(""),
  dueDate: z.string(), // YYYY-MM-DD
});

deadlinesRouter.post("/", async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { dueDate, ...rest } = parsed.data;
  const deadline = await prisma.deadline.create({
    data: { ...rest, dueDate: new Date(dueDate + "T00:00:00"), userId: req.userId! },
  });
  res.status(201).json(deadline);
});

deadlinesRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const existing = await prisma.deadline.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!existing) {
    return res.status(404).json({ error: "Deadline not found" });
  }
  await prisma.deadline.delete({ where: { id: existing.id } });
  res.status(204).send();
});
