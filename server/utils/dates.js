const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Monday-based start of week (Europe/CZ convention), at 00:00 local time.
const startOfWeek = (date) => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday ... 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
  return addDays(d, diff);
};

// "YYYY-MM-DD" in local time (avoids the UTC off-by-one of toISOString).
const localDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDay = (a, b) => localDateString(a) === localDateString(b);

module.exports = {
  MS_PER_DAY,
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  localDateString,
  isSameDay,
};
