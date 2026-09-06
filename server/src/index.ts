import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { activitiesRouter } from "./routes/activities";
import { goalsRouter } from "./routes/goals";
import { deadlinesRouter } from "./routes/deadlines";
import { streakRouter } from "./routes/streak";
import { togglesRouter } from "./routes/toggles";
import { profileRouter } from "./routes/profile";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/deadlines", deadlinesRouter);
app.use("/api/streak", streakRouter);
app.use("/api/toggles", togglesRouter);
app.use("/api/profile", profileRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Schedme API listening on http://localhost:${port}`);
});

// Render's free tier spins the service down after ~15 min with no inbound
// requests. Self-pinging the public URL keeps it looking active so it never
// hits that threshold. RENDER_EXTERNAL_URL is only set when deployed there.
const externalUrl = process.env.RENDER_EXTERNAL_URL;
if (externalUrl) {
  setInterval(() => {
    fetch(`${externalUrl}/health`).catch((err) => {
      console.error("Keep-alive self-ping failed:", err.message);
    });
  }, 10 * 60 * 1000);
}
