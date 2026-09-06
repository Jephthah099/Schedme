import { PrismaClient, Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@schedme.app";
const DEMO_PASSWORD = "password123";

function dateOnly(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } }); // cascades to their data

  const today = dateOnly(new Date());
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      passwordHash,
      name: "Demo student",
      subtitle: "MB ChB Year 3 · Clinical rotations · KNUST",
      dailyTargetH: 8,
      toggles: {
        create: [
          { key: "before", enabled: true },
          { key: "drift", enabled: true },
          { key: "recap", enabled: true },
          { key: "digest", enabled: false },
        ],
      },
      // Today's demo schedule — mirrors the design handoff's "Demo day" block-by-block.
      activities: {
        create: [
          {
            title: "Cardiology lecture",
            place: "Lecture Theatre 2",
            category: Category.Lecture,
            date: today,
            start: 8 * 60,
            duration: 90,
            done: true,
          },
          {
            title: "Anatomy dissection",
            place: "Dissection Room",
            category: Category.Lab,
            date: today,
            start: 10 * 60,
            duration: 120,
            done: true,
          },
          {
            title: "Ward round",
            place: "Ward 4",
            category: Category.Clinical,
            date: today,
            start: 13 * 60,
            duration: 60,
            done: false,
          },
          {
            title: "Pharmacology revision",
            place: "Library",
            category: Category.Study,
            date: today,
            start: 15 * 60,
            duration: 90,
            done: false,
          },
          {
            title: "OSCE practice",
            place: "Clinical Skills Suite",
            category: Category.Clinical,
            date: today,
            start: 17 * 60 + 30,
            duration: 60,
            done: false,
          },
          {
            title: "Path notes review",
            place: "Library",
            category: Category.Study,
            date: today,
            start: 20 * 60,
            duration: 45,
            done: false,
          },
        ],
      },
      goals: {
        create: [
          { subject: "Cardiology", hoursGoal: 8, hoursDone: 6.5 },
          { subject: "Anatomy", hoursGoal: 6, hoursDone: 4 },
          { subject: "Pharmacology", hoursGoal: 5, hoursDone: 2.5 },
        ],
      },
      deadlines: {
        create: [
          {
            title: "OSCE cardiovascular station",
            subtitle: "Clinical Skills Suite",
            dueDate: addDays(today, 9),
          },
          {
            title: "Pathology case write-up",
            subtitle: "Submit via portal",
            dueDate: addDays(today, 16),
          },
          {
            title: "Pharmacology in-course test",
            subtitle: "Lecture Theatre 2",
            dueDate: addDays(today, 23),
          },
        ],
      },
    },
  });

  console.log(`Seeded demo user: ${user.email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
