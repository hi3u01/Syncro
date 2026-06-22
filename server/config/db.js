const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("[DATABASE] MONGO_URI is not set. Check server/.env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `[DATABASE] SYNCRO connected to MongoDB (${conn.connection.name})`,
    );
  } catch (err) {
    console.error("[DATABASE] Connection failed:", err.name, "-", err.message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("[DATABASE] Runtime error:", err.name, "-", err.message);
  });
};

module.exports = connectDB;
