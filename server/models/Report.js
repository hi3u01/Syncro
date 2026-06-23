const mongoose = require("mongoose");
const { RPE, WELLNESS, NOTE_MAX } = require("../constants/validation");

const WellnessSchema = new mongoose.Schema(
  {
    fatigue: {
      type: Number,
      min: WELLNESS.MIN,
      max: WELLNESS.MAX,
      required: true,
    },
    sleep: {
      type: Number,
      min: WELLNESS.MIN,
      max: WELLNESS.MAX,
      required: true,
    },
    soreness: {
      type: Number,
      min: WELLNESS.MIN,
      max: WELLNESS.MAX,
      required: true,
    },
    stress: {
      type: Number,
      min: WELLNESS.MIN,
      max: WELLNESS.MAX,
      required: true,
    },
    mood: {
      type: Number,
      min: WELLNESS.MIN,
      max: WELLNESS.MAX,
      required: true,
    },
  },
  { _id: false },
);

const ReportSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    rpe: {
      type: Number,
      min: 0,
      max: RPE.MAX,
      required: true,
    },
    trainingLoad: {
      type: Number,
      required: true,
      default: 0,
    },
    wellness: {
      type: WellnessSchema,
      required: true,
    },
    note: {
      type: String,
      maxlength: NOTE_MAX,
      trim: true,
    },
  },
  { timestamps: true },
);

// A player submits at most one report per event
ReportSchema.index({ playerId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Report", ReportSchema);
