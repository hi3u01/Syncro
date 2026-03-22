const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/reports", reportRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("[DATABASE] SYNCRO connected to MongoDB"))
  .catch((err) => console.error("[DATABASE] SYNCRO connection error:", err));

app.get("/", (req, res) => {
  res.send("SYNCRO API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] SYNCRO server is running on port ${PORT}`);
});
