const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
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
    },
    plannedDuration: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
