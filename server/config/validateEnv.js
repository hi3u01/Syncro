const REQUIRED = ["MONGO_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(
      `[CONFIG] Missing required env vars: ${missing.join(", ")}. Check server/.env`,
    );
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 32) {
    console.warn(
      "[CONFIG] JWT_SECRET is shorter than 32 chars — use a long random secret in production.",
    );
  }
};

module.exports = validateEnv;
