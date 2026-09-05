import { Router } from "express";
import { prisma } from "../prisma";

export const profileRouter = Router();

profileRouter.get("/", async (_req, res) => {
  const profile = await prisma.profileInfo.findFirst();
  if (!profile) return res.status(404).json({ error: "No profile seeded" });
  res.json(profile);
});
