const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Team membership is authoritatively held on User.teamId.
// The `players` virtual just derives the roster for convenience when fetching a team.
TeamSchema.virtual("players", {
  ref: "User",
  localField: "_id",
  foreignField: "teamId",
});

module.exports = mongoose.model("Team", TeamSchema);
