import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

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
  await prisma.activity.deleteMany();
  await prisma.subjectGoal.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.dayLog.deleteMany();
  await prisma.notificationToggle.deleteMany();
  await prisma.profileInfo.deleteMany();

  const today = dateOnly(new Date());

  // Today's demo schedule — mirrors the README's "Demo day" block-by-block.
  await prisma.activity.createMany({
    data: [
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
  });

  // Weekly subject goals — shared by the Progress rings and the Goals screen's weekly targets.
  await prisma.subjectGoal.createMany({
    data: [
      { subject: "Cardiology", hoursGoal: 8, hoursDone: 6.5 },
      { subject: "Anatomy", hoursGoal: 6, hoursDone: 4 },
      { subject: "Pharmacology", hoursGoal: 5, hoursDone: 2.5 },
    ],
  });

  await prisma.deadline.createMany({
    data: [
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
  });

  // 14-day streak ending today, one miss 10 days back ("post-call day").
  const dayLogs = Array.from({ length: 14 }).map((_, i) => {
    const offset = 13 - i; // oldest first
    const date = addDays(today, -offset);
    return { date, kept: offset !== 10 };
  });
  await prisma.dayLog.createMany({ data: dayLogs });

  await prisma.notificationToggle.createMany({
    data: [
      { key: "before", enabled: true },
      { key: "drift", enabled: true },
      { key: "recap", enabled: true },
      { key: "digest", enabled: false },
    ],
  });

  await prisma.profileInfo.create({
    data: {
      name: "Your name",
      subtitle: "MB ChB Year 3 · Clinical rotations · KNUST",
      hoursLogged: 412,
      planKeptPct: 86,
      bestStreak: 31,
      dailyTargetH: 8,
    },
  });

  console.log("Seeded Schudme demo data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
