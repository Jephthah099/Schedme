export function parseDateParam(value: unknown): Date {
  if (typeof value === "string" && value.length > 0) {
    const parsed = new Date(value + "T00:00:00");
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function toDateOnlyISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
