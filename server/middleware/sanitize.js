const scrub = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }
    const value = obj[key];
    if (value && typeof value === "object") scrub(value);
  }
};

const sanitize = (req, res, next) => {
  scrub(req.body);
  scrub(req.params);
  try {
    scrub(req.query);
  } catch {}
  next();
};

module.exports = sanitize;
