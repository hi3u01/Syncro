const express = require("express");
require("dotenv").config();

const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const teamsRoutes = require("./routes/teams");
const eventRoutes = require("./routes/events");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Connection to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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
