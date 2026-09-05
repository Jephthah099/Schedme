import { Router } from "express";
import { prisma } from "../prisma";

export const streakRouter = Router();

streakRouter.get("/", async (_req, res) => {
  const days = await prisma.dayLog.findMany({ orderBy: { date: "asc" } });

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].kept) current++;
    else break;
  }

  res.json({ days, current });
});
