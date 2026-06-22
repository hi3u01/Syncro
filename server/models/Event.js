const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Trénink", "Regenerace", "Zápas", "Volno"],
    },
    title: {
      type: String,
      trim: true,
    },
    plannedDuration: {
      type: Number,
    },
    plannedRpe: {
      type: Number,
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
