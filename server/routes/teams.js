const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Team = require("../models/Team");
const User = require("../models/User");
const { protect, coachOnly } = require("../middleware/auth");

// POST /teams - Create a new team
router.post("/", protect, coachOnly, async (req, res) => {
  try {
    const { name } = req.body;
    // Generate a random 6-character HEX string
    let generatedCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    let isUnique = false;
    while (!isUnique) {
      const existingTeam = await Team.findOne({ joinCode: generatedCode });
      if (existingTeam) {
        generatedCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      } else {
        isUnique = true;
      }
    }

    const team = await Team.create({
      name,
      joinCode: generatedCode,
      coachId: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /teams/ - Get coach's team info
router.get("/", protect, coachOnly, async (req, res) => {
  try {
    const team = await Team.find({ coachId: req.user._id });
    if (!team) {
      return res.status(404).json({ message: "No team found for this coach." });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /teams/players - Get all players in the coach's team
router.get("/players", protect, coachOnly, async (req, res) => {
  try {
    const teams = await Team.find({ coachId: req.user._id });

    if (!teams) {
      return res.status(404).json({ message: "Team not found." });
    }

    const teamIds = teams.map((team) => team._id);

    const players = await User.find({
      role: "player",
      teamId: { $in: teamIds },
    }).select("-password");

    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
