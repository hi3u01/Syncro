const express = require("express");
require("dotenv").config();

const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const teamsRoutes = require("./routes/teams");
const eventRoutes = require("./routes/events");

const app = express();

// Connection to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/reports", reportRoutes);
app.use("/teams", teamsRoutes);
app.use("/events", eventRoutes);

// Testing route
app.get("/", (req, res) => {
  res.send("SYNCRO API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] SYNCRO server is running on port ${PORT}`);
});
