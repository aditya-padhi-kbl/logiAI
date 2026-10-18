export const SEED_NOW = new Date("2026-09-21T00:00:00Z");

export const daysAgo = (days: number, hours = 0) =>
  new Date(SEED_NOW.getTime() - (days * 24 + hours) * 60 * 60 * 1000);
