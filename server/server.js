const express = require("express");
require("dotenv").config();

const cors = require("cors");
const validateEnv = require("./config/validateEnv");
const connectDB = require("./config/db");
const sanitize = require("./middleware/sanitize");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const teamsRoutes = require("./routes/teams");
const eventRoutes = require("./routes/events");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Verify required secrets exist before doing anything else.
validateEnv();

const app = express();

// Connection to database
connectDB();

// Middleware
// Restrict CORS to the known client origin (override with CLIENT_URL in production).
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.use(sanitize);

app.get("/", (req, res) => {
  res.send("SYNCRO API is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/events", eventRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] SYNCRO server is running on port ${PORT}`);
});
