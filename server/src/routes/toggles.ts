import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";

export const togglesRouter = Router();

togglesRouter.get("/", async (_req, res) => {
  const toggles = await prisma.notificationToggle.findMany();
  res.json(toggles);
});

const patchSchema = z.object({ enabled: z.boolean() });

togglesRouter.patch("/:key", async (req, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const toggle = await prisma.notificationToggle.update({
      where: { key: req.params.key },
      data: { enabled: parsed.data.enabled },
    });
    res.json(toggle);
  } catch {
    res.status(404).json({ error: "Toggle not found" });
  }
});
