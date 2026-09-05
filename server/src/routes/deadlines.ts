import { Router } from "express";
import { prisma } from "../prisma";

export const deadlinesRouter = Router();

deadlinesRouter.get("/", async (_req, res) => {
  const deadlines = await prisma.deadline.findMany({ orderBy: { dueDate: "asc" } });
  const now = Date.now();
  res.json(
    deadlines.map((d) => ({
      ...d,
      daysLeft: Math.max(0, Math.ceil((d.dueDate.getTime() - now) / 86_400_000)),
    }))
  );
});
