const PH_TZ = "Asia/Manila";
const PH_UTC_OFFSET_MINUTES = 8 * 60;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function getTodayInPhilippinesYmd(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: PH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Failed to resolve Philippines date");
  }

  return `${year}-${month}-${day}`;
}

export function parseYmd(value: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function getUtcBoundsForPhilippinesDay(ymd: string): {
  startUtc: Date;
  endUtc: Date;
  canonicalYmd: string;
} {
  const parsed = parseYmd(ymd);
  if (!parsed) {
    throw new Error("Invalid date. Expected YYYY-MM-DD.");
  }

  const { year, month, day } = parsed;
  const startMs =
    Date.UTC(year, month - 1, day, 0, 0, 0, 0) -
    PH_UTC_OFFSET_MINUTES * 60 * 1000;

  return {
    startUtc: new Date(startMs),
    endUtc: new Date(startMs + MS_PER_DAY),
    canonicalYmd: `${year}-${pad2(month)}-${pad2(day)}`,
  };
}
