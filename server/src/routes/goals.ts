import { Router } from "express";
import { prisma } from "../prisma";

export const goalsRouter = Router();

goalsRouter.get("/", async (_req, res) => {
  const goals = await prisma.subjectGoal.findMany();
  res.json(goals);
});
