export const RPE = { MIN: 1, MAX: 10 };
export const WELLNESS = { MIN: 1, MAX: 5 };
export const NOTE_MAX = 200;

export const AT_RISK_THRESHOLD = 2.5;

export const WELLNESS_KEYS = ["fatigue", "sleep", "soreness", "stress", "mood"];

// Event types that count as rest (no physical load => the RPE/duration inputs are disabled).
export const REST_EVENT_TYPES = ["Volno", "Regenerace"];

export const isRestEventType = (type) => REST_EVENT_TYPES.includes(type);
