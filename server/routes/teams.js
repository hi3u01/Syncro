const express = require("express");
const router = express.Router();
const { protect, coachOnly } = require("../middleware/auth");
const {
  createTeam,
  getCoachTeams,
  getTeamPlayers,
} = require("../controllers/teamController");

router.post("/", protect, coachOnly, createTeam);
router.get("/", protect, coachOnly, getCoachTeams);
router.get("/players", protect, coachOnly, getTeamPlayers);

module.exports = router;
