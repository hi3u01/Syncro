const MS_PER_DAY = 24 * 60 * 60 * 1000;

// All week/day bucketing follows the Europe/CZ convention and must be computed
// in Prague wall-clock time regardless of the server's timezone (production runs
// in UTC). We therefore derive every boundary explicitly in this zone instead of
// relying on the process-local Date getters.
const TIME_ZONE = "Europe/Prague";

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
});

// Wall-clock fields of `date` as seen in Europe/Prague.
const zonedParts = (date) => {
  const fields = {};
  for (const part of partsFormatter.formatToParts(new Date(date))) {
    if (part.type !== "literal") fields[part.type] = part.value;
  }
  return {
    year: Number(fields.year),
    month: Number(fields.month), // 1-12
    day: Number(fields.day),
    hour: Number(fields.hour),
    minute: Number(fields.minute),
    second: Number(fields.second),
    weekday: WEEKDAY_INDEX[fields.weekday], // 0 = Sunday ... 6 = Saturday
  };
};

// Offset (ms) such that Prague wall-clock = UTC instant + offset, at `date`.
const offsetMs = (date) => {
  const p = zonedParts(date);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUTC - new Date(date).getTime();
};

// The absolute instant of a given Europe/Prague wall-clock time (month is 0-based).
const fromZoned = (year, month, day, hour = 0, minute = 0, second = 0, ms = 0) => {
  const guess = Date.UTC(year, month, day, hour, minute, second, ms);
  return new Date(guess - offsetMs(new Date(guess)));
};

const startOfDay = (date) => {
  const p = zonedParts(date);
  return fromZoned(p.year, p.month - 1, p.day, 0, 0, 0, 0);
};

const endOfDay = (date) => {
  const p = zonedParts(date);
  return fromZoned(p.year, p.month - 1, p.day, 23, 59, 59, 999);
};

const addDays = (date, days) => {
  const p = zonedParts(date);
  return fromZoned(p.year, p.month - 1, p.day + days, p.hour, p.minute, p.second);
};

// Monday-based start of week (Europe/CZ convention), at 00:00 Prague time.
const startOfWeek = (date) => {
  const p = zonedParts(date);
  const diff = p.weekday === 0 ? -6 : 1 - p.weekday; // shift back to Monday
  return fromZoned(p.year, p.month - 1, p.day + diff, 0, 0, 0, 0);
};

// "YYYY-MM-DD" in Prague time (avoids the UTC off-by-one of toISOString).
const localDateString = (date) => {
  const p = zonedParts(date);
  const month = String(p.month).padStart(2, "0");
  const day = String(p.day).padStart(2, "0");
  return `${p.year}-${month}-${day}`;
};

const isSameDay = (a, b) => localDateString(a) === localDateString(b);

module.exports = {
  MS_PER_DAY,
  TIME_ZONE,
  zonedParts,
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  localDateString,
  isSameDay,
};
