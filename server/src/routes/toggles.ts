import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { AuthedRequest, requireAuth } from "../middleware/auth";

export const togglesRouter = Router();
togglesRouter.use(requireAuth);

togglesRouter.get("/", async (req: AuthedRequest, res) => {
  const toggles = await prisma.notificationToggle.findMany({ where: { userId: req.userId! } });
  res.json(toggles);
});

const patchSchema = z.object({ enabled: z.boolean() });

togglesRouter.patch("/:key", async (req: AuthedRequest, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const toggle = await prisma.notificationToggle.update({
      where: { userId_key: { userId: req.userId!, key: req.params.key } },
      data: { enabled: parsed.data.enabled },
    });
    res.json(toggle);
  } catch {
    res.status(404).json({ error: "Toggle not found" });
  }
});
