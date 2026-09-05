import "dotenv/config";
import express from "express";
import cors from "cors";
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

app.use("/api/activities", activitiesRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/deadlines", deadlinesRouter);
app.use("/api/streak", streakRouter);
app.use("/api/toggles", togglesRouter);
app.use("/api/profile", profileRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Schudme API listening on http://localhost:${port}`);
});
