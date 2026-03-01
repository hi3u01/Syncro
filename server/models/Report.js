const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rpe: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  fatigue: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  sleep: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  soreness: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  stress: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  mood: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  note: {
    type: String,
    maxlength: 500,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
