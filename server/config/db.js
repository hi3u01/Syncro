const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("[DATABASE] SYNCRO connected to MongoDB"))
    .catch((err) => console.error("[DATABASE] SYNCRO connection error:", err));
};

module.exports = connectDB;
