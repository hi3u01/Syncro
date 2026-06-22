const RPE = { MIN: 1, MAX: 10 };
const WELLNESS = { MIN: 1, MAX: 5 };
const NOTE_MAX = 200;

// Wellness parameter under this threshold flags an at-risk player (Hooper index).
const AT_RISK_THRESHOLD = 2.5;

const WELLNESS_KEYS = ["fatigue", "sleep", "soreness", "stress", "mood"];

// Event types that count as rest (no physical load => Training Load = 0).
const REST_EVENT_TYPES = ["Volno", "Regenerace"];

module.exports = {
  RPE,
  WELLNESS,
  NOTE_MAX,
  AT_RISK_THRESHOLD,
  WELLNESS_KEYS,
  REST_EVENT_TYPES,
};
